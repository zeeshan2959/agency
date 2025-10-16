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
const Maintenence = lazy(() => import('../pages/Pages/Maintenence'));
const LoginBoxed = lazy(() => import('../pages/Authentication/LoginBoxed'));
const RegisterBoxed = lazy(() => import('../pages/Authentication/RegisterBoxed'));
const UnlockBoxed = lazy(() => import('../pages/Authentication/UnlockBox'));
const RecoverIdBoxed = lazy(() => import('../pages/Authentication/RecoverIdBox'));
const LoginCover = lazy(() => import('../pages/Authentication/LoginCover'));
const RegisterCover = lazy(() => import('../pages/Authentication/RegisterCover'));
const RecoverIdCover = lazy(() => import('../pages/Authentication/RecoverIdCover'));
const UnlockCover = lazy(() => import('../pages/Authentication/UnlockCover'));

// New Routes by zeeshan

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
    // dashboard
    // {
    //     path: '/',
    //     element: <LoginBoxed />,
    // },

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
        path: '/pages/maintenence',
        element: <Maintenence />,
        layout: 'blank',
    },
    //Authentication
    {
        path: '/',
        element: <LoginBoxed />,
        layout: 'blank',
    },
    {
        path: '/login',
        element: <LoginBoxed />,
        layout: 'blank',
    },
    {
        path: '/register',
        element: <RegisterBoxed />,
        layout: 'blank',
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
    {
        path: '/auth/cover-login',
        element: <LoginCover />,
        layout: 'blank',
    },
    {
        path: '/auth/cover-register',
        element: <RegisterCover />,
        layout: 'blank',
    },
    {
        path: '/auth/cover-lockscreen',
        element: <UnlockCover />,
        layout: 'blank',
    },
    {
        path: '/auth/cover-password-reset',
        element: <RecoverIdCover />,
        layout: 'blank',
    },

    // New Pages by Zeeshan

    // Inventory

    // brands
    {
        path: '/brands',
        element: <Brands />,
    },
    {
        path: '/brands/create',
        element: <AddBrand />,
    },
    {
        path: '/brands/edit',
        element: <EditBrand />,
    },
    {
        path: '/brands/deleted',
        element: <DeletedBrands />,
    },

    // categories
    {
        path: '/categories',
        element: <Categories />,
    },
    {
        path: '/categories/create',
        element: <AddCategory />,
    },
    {
        path: '/categories/edit',
        element: <EditCategory />,
    },
    {
        path: '/categories/deleted',
        element: <DeletedCategories />,
    },

    // Products
    {
        path: '/products',
        element: <Products />,
    },
    {
        path: '/products/create',
        element: <AddProduct />,
    },
    {
        path: '/products/edit',
        element: <UpdateProduct />,
    },
    {
        path: '/products/deleted',
        element: <DeletedProducts />,
    },
    {
        path: '/products/batch/create',
        element: (
            <AddBatch/>
        ),
    },
    {
        path: '/products/batch/edit',
        element: (
            <UpdateBatch/>
        ),
    },
    {
        path: '/products/batches',
        element: (
            <Batches/>
        ),
    },

    // Retailers
    {
        path: '/retailers',
        element: (
            <Retailers/>
        ),
    },
    {
        path: '/retailers/create',
        element: (
            <AddRetailer/>
        ),
    },
    {
        path: '/retailers/edit',
        element: (
            <UpdateRetailer/>
        ),
    },
    {
        path: '/retailers/deleted',
        element: (
            <DeletedRetailers/>
        ),
    },
];

export { routes };
