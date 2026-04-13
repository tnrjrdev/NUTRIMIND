import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom';
import { AdminLayout } from './features/admin/components/AdminLayout';
import { AdminDashboardPage } from './features/admin/pages/AdminDashboardPage';
import { BemEstarAdminPage } from './features/admin/pages/BemEstarAdminPage';
import { ChasAdminPage } from './features/admin/pages/ChasAdminPage';
import { DicasAdminPage } from './features/admin/pages/DicasAdminPage';
import { FornecedoresAdminPage } from './features/admin/pages/FornecedoresAdminPage';
import { IfoodAdminPage } from './features/admin/pages/IfoodAdminPage';
import { ProdutosAdminPage } from './features/admin/pages/ProdutosAdminPage';
import { ReceitasAdminPage } from './features/admin/pages/ReceitasAdminPage';
import { SubstituicoesAdminPage } from './features/admin/pages/SubstituicoesAdminPage';
import { UsuariosAdminPage } from './features/admin/pages/UsuariosAdminPage';
import { ProtectedRoute } from './features/auth/components/ProtectedRoute';
import { LoginPage } from './features/auth/pages/LoginPage';
import { RegisterPage } from './features/auth/pages/RegisterPage';
import { BemEstarDetailPage } from './features/bem-estar/pages/BemEstarDetailPage';
import { BemEstarPage } from './features/bem-estar/pages/BemEstarPage';
import { ChaCategoryPage } from './features/chas/pages/ChaCategoryPage';
import { ChaDetailPage } from './features/chas/pages/ChaDetailPage';
import { ChasPage } from './features/chas/pages/ChasPage';
import { DicaDetailPage } from './features/dicas/pages/DicaDetailPage';
import { DicasPage } from './features/dicas/pages/DicasPage';
import { HomePage } from './features/feature/home/pages/HomePage';
import { RecipeCategoryPage } from './features/feature/recipes/pages/RecipeCategoryPage';
import { RecipeDetailPage } from './features/feature/recipes/pages/RecipeDetailPage';
import { RecipesPage } from './features/feature/recipes/pages/RecipesPage';
import { FornecedorCategoryPage } from './features/fornecedores/pages/FornecedorCategoryPage';
import { FornecedorDetailPage } from './features/fornecedores/pages/FornecedorDetailPage';
import { FornecedoresPage } from './features/fornecedores/pages/FornecedoresPage';
import { IfoodCategoryPage } from './features/ifood/pages/IfoodCategoryPage';
import { IfoodDetailPage } from './features/ifood/pages/IfoodDetailPage';
import { IfoodPage } from './features/ifood/pages/IfoodPage';
import { ProductCategoryPage } from './features/products/pages/ProductCategoryPage';
import { ProductDetailPage } from './features/products/pages/ProductDetailPage';
import { ProductsPage } from './features/products/pages/ProductsPage';
import { SubstituicaoCategoryPage } from './features/substituicoes/pages/SubstituicaoCategoryPage';
import { SubstituicaoDetailPage } from './features/substituicoes/pages/SubstituicaoDetailPage';
import { SubstituicoesPage } from './features/substituicoes/pages/SubstituicoesPage';

export function AppRoutes() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Navigate to="/login" replace />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/cadastro" element={<RegisterPage />} />

        <Route path="/admin" element={<ProtectedRoute />}>
          <Route element={<AdminLayout />}>
            <Route index element={<Navigate to="/admin/dashboard" replace />} />
            <Route path="dashboard" element={<AdminDashboardPage />} />
            <Route path="usuarios" element={<UsuariosAdminPage />} />
            <Route path="receitas" element={<ReceitasAdminPage />} />
            <Route path="produtos" element={<ProdutosAdminPage />} />
            <Route path="fornecedores" element={<FornecedoresAdminPage />} />
            <Route path="ifood" element={<IfoodAdminPage />} />
            <Route path="chas" element={<ChasAdminPage />} />
            <Route path="substituicoes" element={<SubstituicoesAdminPage />} />
            <Route path="bem-estar" element={<BemEstarAdminPage />} />
            <Route path="dicas" element={<DicasAdminPage />} />
          </Route>
        </Route>

        <Route element={<ProtectedRoute />}>
          <Route path="/home" element={<HomePage />} />
          <Route path="/receitas" element={<RecipesPage />} />
          <Route path="/receitas/categoria/:categoriaId" element={<RecipeCategoryPage />} />
          <Route path="/receitas/:id" element={<RecipeDetailPage />} />
          <Route path="/produtos" element={<ProductsPage />} />
          <Route path="/produtos/categoria/:categoriaId" element={<ProductCategoryPage />} />
          <Route path="/produtos/:id" element={<ProductDetailPage />} />
          <Route path="/fornecedores" element={<FornecedoresPage />} />
          <Route path="/fornecedores/categoria/:categoriaId" element={<FornecedorCategoryPage />} />
          <Route path="/fornecedores/:id" element={<FornecedorDetailPage />} />
          <Route path="/ifood" element={<IfoodPage />} />
          <Route path="/ifood/categoria/:categoriaId" element={<IfoodCategoryPage />} />
          <Route path="/ifood/:id" element={<IfoodDetailPage />} />
          <Route path="/chas" element={<ChasPage />} />
          <Route path="/chas/categoria/:categoriaId" element={<ChaCategoryPage />} />
          <Route path="/chas/:id" element={<ChaDetailPage />} />
          <Route path="/substituicoes" element={<SubstituicoesPage />} />
          <Route path="/substituicoes/categoria/:categoriaId" element={<SubstituicaoCategoryPage />} />
          <Route path="/substituicoes/:id" element={<SubstituicaoDetailPage />} />
          <Route path="/bem-estar" element={<BemEstarPage />} />
          <Route path="/bem-estar/:id" element={<BemEstarDetailPage />} />
          <Route path="/dicas" element={<DicasPage />} />
          <Route path="/dicas/:id" element={<DicaDetailPage />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}
