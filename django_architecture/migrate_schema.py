"""
One-time migration: alinha o schema do SQLite (criado pelo Prisma) ao backend Django.

- Adiciona colunas que faltavam (Receita.destaque, Cha.usoAdulto/usoInfantil,
  BemEstarItem.telefone/whatsapp).
- Converte timestamps Prisma (Unix ms armazenado como integer/string) para
  ISO datetime que o Django/DRF consegue parsear.

Idempotente: pode rodar mais de uma vez sem erro.
"""
import os
import sqlite3
from datetime import datetime, timezone

DB_PATH = os.path.join(os.path.dirname(__file__), "..", "dev.db")

NEW_COLUMNS = [
    ("Receita", "destaque", "BOOLEAN NOT NULL DEFAULT 0"),
    ("Cha", "usoAdulto", "BOOLEAN NOT NULL DEFAULT 0"),
    ("Cha", "usoInfantil", "BOOLEAN NOT NULL DEFAULT 0"),
    ("BemEstarItem", "telefone", "TEXT"),
    ("BemEstarItem", "whatsapp", "BOOLEAN NOT NULL DEFAULT 0"),
]

TIMESTAMP_TABLES = [
    "Receita", "CategoriaReceita", "Produto", "CategoriaProduto",
    "Fornecedor", "CategoriaFornecedor", "Cha", "CategoriaCha",
    "RestauranteIfood", "CategoriaIfood", "ItemSubstituicao",
    "CategoriaSubstituicao", "Ingrediente", "ModoPreparo",
    "CupomDesconto", "BemEstarItem", "Dica",
]


def column_exists(cur, table, column):
    cur.execute(f'PRAGMA table_info("{table}")')
    return any(row[1] == column for row in cur.fetchall())


def add_missing_columns(cur):
    for table, column, ddl in NEW_COLUMNS:
        if column_exists(cur, table, column):
            print(f"[skip] {table}.{column} ja existe")
            continue
        cur.execute(f'ALTER TABLE "{table}" ADD COLUMN {column} {ddl}')
        print(f"[ok]   {table}.{column} adicionada")


def normalize_to_iso(value):
    """Converte timestamps Prisma (Unix ms) para ISO. Mantem strings ISO ja validas."""
    if value is None:
        return None
    if isinstance(value, (int, float)):
        ms = float(value)
    else:
        s = str(value).strip()
        if not s:
            return None
        try:
            ms = float(s)
        except ValueError:
            return s
    if ms > 1e12:
        seconds = ms / 1000.0
    else:
        seconds = ms
    try:
        dt = datetime.fromtimestamp(seconds, tz=timezone.utc)
    except (OverflowError, OSError, ValueError):
        return str(value)
    return dt.strftime("%Y-%m-%d %H:%M:%S.%f")


def normalize_timestamps(cur):
    for table in TIMESTAMP_TABLES:
        try:
            cur.execute(f'SELECT id, createdAt, updatedAt FROM "{table}"')
        except sqlite3.OperationalError as exc:
            print(f"[skip] {table}: {exc}")
            continue
        rows = cur.fetchall()
        updated = 0
        for row_id, created, updated_at in rows:
            new_created = normalize_to_iso(created)
            new_updated = normalize_to_iso(updated_at)
            if new_created != created or new_updated != updated_at:
                cur.execute(
                    f'UPDATE "{table}" SET createdAt = ?, updatedAt = ? WHERE id = ?',
                    (new_created, new_updated, row_id),
                )
                updated += 1
        if rows:
            print(f"[ts]   {table}: {updated}/{len(rows)} linhas normalizadas")


def main():
    con = sqlite3.connect(DB_PATH)
    cur = con.cursor()
    try:
        add_missing_columns(cur)
        normalize_timestamps(cur)
        con.commit()
    finally:
        con.close()


if __name__ == "__main__":
    main()
