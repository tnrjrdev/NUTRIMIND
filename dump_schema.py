import sqlite3

def test_db():
    conn = sqlite3.connect('dev.db')
    cursor = conn.cursor()
    cursor.execute("SELECT name FROM sqlite_master WHERE type='table';")
    tables = cursor.fetchall()
    
    with open("db_schema.txt", "w") as f:
        f.write("TABLES:\n")
        for table in tables:
            tname = table[0]
            f.write(f"\n{tname}\n")
            cursor.execute(f"PRAGMA table_info('{tname}')")
            cols = cursor.fetchall()
            for col in cols:
                f.write(f"  {col[1]} ({col[2]})\n")

if __name__ == '__main__':
    test_db()
