import { lazy } from 'react';
const Basic = lazy(() => import('../pages/DataTables/Basic'));
const Advanced = lazy(() => import('../pages/DataTables/Advanced'));
const Skin = lazy(() => import('../pages/DataTables/Skin'));
const OrderSorting = lazy(() => import('../pages/DataTables/OrderSorting'));
const MultiColumn = lazy(() => import('../pages/DataTables/MultiColumn'));
const MultipleTables = lazy(() => import('../pages/DataTables/MultipleTables'));
const AltPagination = lazy(() => import('../pages/DataTables/AltPagination'));
const Checkbox = lazy(() => import('../pages/DataTables/Checkbox'));
const RangeSearch = lazy(() => import('../pages/DataTables/RangeSearch'));
const Export = lazy(() => import('../pages/DataTables/Export'));
const ColumnChooser = lazy(() => import('../pages/DataTables/ColumnChooser'));
const Profile = lazy(() => import('../pages/Users/Profile'));
const AccountSetting = lazy(() => import('../pages/Users/AccountSetting'));
const KnowledgeBase = lazy(() => import('../pages/Pages/KnowledgeBase'));
const ContactUsBoxed = lazy(() => import('../pages/Pages/ContactUsBoxed'));
const ContactUsCover = lazy(() => import('../pages/Pages/ContactUsCover'));
const Faq = lazy(() => import('../pages/Pages/Faq'));
const ComingSoonBoxed = lazy(() => import('../pages/Pages/ComingSoonBoxed'));
const ComingSoonCover = lazy(() => import('../pages/Pages/ComingSoonCover'));
const ERROR404 = lazy(() => import('../pages/Pages/Error404'));
const ERROR500 = lazy(() => import('../pages/Pages/Error500'));
const ERROR503 = lazy(() => import('../pages/Pages/Error503'));
const Maintenance = lazy(() => import('../pages/Pages/Maintenance'));
const LoginBoxed = lazy(() => import('../pages/Authentication/LoginBoxed'));
const RegisterBoxed = lazy(() => import('../pages/Authentication/RegisterBoxed'));
const UnlockBoxed = lazy(() => import('../pages/Authentication/UnlockBox'));
const RecoverIdBoxed = lazy(() => import('../pages/Authentication/RecoverIdBox'));

// New Routes by zeeshan

// dashboard
const Dashboard = lazy(() => import('../pages/Dashboard'));

// brands
const Brands = lazy(() => import('../pages/Inventory/brands/Brands'));
const AddBrand = lazy(() => import('../pages/Inventory/brands/AddBrand'));
const EditBrand = lazy(() => import('../pages/Inventory/brands/EditBrand'));
const DeletedBrands = lazy(() => import('../pages/Inventory/brands/DeletedBrands'));

// categories
const Categories = lazy(() => import('../pages/Inventory/categories/Categories'));
const AddCategory = lazy(() => import('../pages/Inventory/categories/AddCategory'));
const DeletedCategories = lazy(() => import('../pages/Inventory/categories/DeletedCategories'));
const EditCategory = lazy(() => import('../pages/Inventory/categories/EditCategory'));

// products
const Products = lazy(() => import('../pages/Inventory/products/Products'));
const AddProduct = lazy(() => import('../pages/Inventory/products/AddProduct'));
const UpdateProduct = lazy(() => import('../pages/Inventory/products/UpdateProduct'));
const DeletedProducts = lazy(() => import('../pages/Inventory/products/DeletedProducts'));
const Batches = lazy(() => import('../pages/Inventory/products/Batches'));
const AddBatch = lazy(() => import('../pages/Inventory/products/AddBatch'));
const UpdateBatch = lazy(() => import('../pages/Inventory/products/UpdateBatch'));

// Retailers
const Retailers = lazy(() => import('../pages/Retailers/Retailers'));
const AddRetailer = lazy(() => import('../pages/Retailers/AddRetailer'));
const UpdateRetailer = lazy(() => import('../pages/Retailers/EditRetailer'));
const DeletedRetailers = lazy(() => import('../pages/Retailers/DeletedRetailers'));

const routes = [
    {
        path: '/pages/error404',
        element: <ERROR404 />,
        layout: 'blank',
    },
    {
        path: '/pages/error500',
        element: <ERROR500 />,
        layout: 'blank',
    },
    {
        path: '/pages/error503',
        element: <ERROR503 />,
        layout: 'blank',
    },
    {
        path: '/pages/maintenance',
        element: <Maintenance />,
        layout: 'blank',
    },
    //Authentication
    {
        path: '/',
        element: <Dashboard />,
        auth: 'private',

    },
    {
        path: '/login',
        element: <LoginBoxed />,
        layout: 'blank',
        auth: 'public',
    },
    {
        path: '/register',
        element: <RegisterBoxed />,
        layout: 'blank',
        auth: 'public',
    },
    {
        path: '/auth/boxed-lockscreen',
        element: <UnlockBoxed />,
        layout: 'blank',
    },
    {
        path: '/auth/boxed-password-reset',
        element: <RecoverIdBoxed />,
        layout: 'blank',
    },

    // New Pages by Zeeshan

    // Inventory

    // brands
    {
        path: '/brands',
        element: <Brands />,
        auth: 'private',
    },
    {
        path: '/brands/create',
        element: <AddBrand />,
        auth: 'private',
    },
    {
        path: '/brands/edit',
        element: <EditBrand />,
        auth: 'private',
    },
    {
        path: '/brands/deleted',
        element: <DeletedBrands />,
        auth: 'private',
    },

    // categories
    {
        path: '/categories',
        element: <Categories />,
        auth: 'private',
    },
    {
        path: '/categories/create',
        element: <AddCategory />,
        auth: 'private',
    },
    {
        path: '/categories/edit',
        element: <EditCategory />,
        auth: 'private',
    },
    {
        path: '/categories/deleted',
        element: <DeletedCategories />,
        auth: 'private',
    },

    // Products
    {
        path: '/products',
        element: <Products />,
        auth: 'private',
    },
    {
        path: '/products/create',
        element: <AddProduct />,
        auth: 'private',
    },
    {
        path: '/products/edit',
        element: <UpdateProduct />,
        auth: 'private',
    },
    {
        path: '/products/deleted',
        element: <DeletedProducts />,
        auth: 'private',
    },
    {
        path: '/products/batch/create',
        element: <AddBatch/>,
        auth: 'private',
    },
    {
        path: '/products/batch/edit',
        element: <UpdateBatch/>,
        auth: 'private',
    },
    {
        path: '/products/batches',
        element: <Batches/>,
        auth: 'private',
    },

    // Retailers
    {
        path: '/retailers',
        element: (
            <Retailers/>
        ),
        auth: 'private',
    },
    {
        path: '/retailers/create',
        element: (
            <AddRetailer/>
        ),
        auth: 'private',
    },
    {
        path: '/retailers/edit',
        element: (
            <UpdateRetailer/>
        ),
        auth: 'private',
    },
    {
        path: '/retailers/deleted',
        element: (
            <DeletedRetailers/>
        ),
        auth: 'private',
    },
];

export { routes };
