export enum RoleModel {
  home = "home",

  sale = "sale",

  list_product = "list_product",
  import_product = "import_product",
  return_product = "return_product",
  check_inventory = "check_inventory",
  price_setting = "price_setting",

  market_common = "market_common",
  market_store = "market_store",
  market_setting = "market_setting",

  medicine_category = "medicine_category",

  bill = "bill",
  order = "order",
  return = "return",
  delivery = "delivery",

  customer = "customer",
  group_customer = "group_customer",
  provider = "provider",
  group_provider = "group_provider",
  doctor = "doctor",

  map = "map",

  cashbook = "cashbook",

  customer_report = "customer_report",
  provider_report = "provider_report",
  employee_report = "employee_report",
  sale_report = "sale_report",
  product_report = "product_report",

  store = "store",
  branch = "branch",
  employee = "employee",
  role = "role",
  discount = "discount",
  point_setting = "point_setting",
  connect_system = "connect_system",
  delivery_fee = "delivery_fee",
  connect_delivery = "connect_delivery",
}

export enum RoleLabel {
  home = "Tổng quát",

  sale = "Bán hàng",

  product = "Sản phẩm",
  list_product = "Danh sách sản phẩm",
  import_product = "Nhập sản phẩm",
  return_product = "Trả hàng nhập",
  check_inventory = "Kiểm kho",
  price_setting = "Thiết lập giá",

  market = "Chợ",
  market_common = "Chợ",
  market_store = "Chợ đại lý",
  market_setting = "Cấu hình sản phẩm",

  medicine_category = "Danh mục thuốc",

  transaction = "Giao dịch",
  bill = "Hóa đơn",
  order = "Đơn hàng",
  return = "Trả hàng",
  delivery = "Chuyển hàng",

  partner = "Đối tác",

  customer = "Khách hàng",
  group_customer = "Nhóm khách hàng",
  provider = "Nhà cung cấp",
  group_provider = "Nhóm nhà cung cấp",
  doctor = "Bác sĩ",

  map = "Chăm sóc khách hàng",

  cashbook = "Sổ quỹ",

  report = "Báo cáo",
  customer_report = "Báo cáo khách hàng",
  provider_report = "Báo cáo nhà cung cấp",
  employee_report = "Báo cáo nhân viên",
  sale_report = "Báo cáo bán hàng",
  product_report = "Báo cáo sản phẩm",

  setting = "Cấu hình",
  store = "TT cửa hàng",
  branch = "Quản lý chi nhánh",
  employee = "Quản lý nhân viên",
  role = "Quản lý vai trò và phân quyền",
  discount = "Khuyến mại",
  point_setting = "Thiết lập điểm",
  connect_system = "Liên thông hệ thống dược",
  delivery_fee = "Cấu hình phí vận chuyển",
  connect_delivery = "Kết nối vận chuyển",
}

export enum RoleAction {
  read = "read",
  create = "create",
  update = "update",
  delete = "delete",
}

export const ROLE_DEFAULT = {
  home: {
    all: false,
    read: false,
  },
  sale: {
    all: false,
    read: false,
  },
  product: {
    all: false,
    list_product: {
      all: false,
      read: false,
      create: false,
      update: false,
      delete: false,
    },
    import_product: {
      all: false,
      read: false,
      create: false,
      update: false,
      delete: false,
    },
    return_product: {
      all: false,
      read: false,
      create: false,
      update: false,
      delete: false,
    },
    check_inventory: {
      all: false,
      read: false,
      create: false,
      update: false,
      delete: false,
    },
    price_setting: {
      all: false,
      read: false,
      create: false,
      update: false,
      delete: false,
    },
  },
  market: {
    all: false,
    market_common: {
      all: false,
      read: false,
      create: false,
      update: false,
      delete: false,
    },
    market_store: {
      all: false,
      read: false,
      create: false,
      update: false,
      delete: false,
    },
    market_setting: {
      all: false,
      read: false,
      create: false,
      update: false,
      delete: false,
    },
  },
  medicine_category: {
    all: false,
    read: false,
    create: false,
    update: false,
    delete: false,
  },
  transaction: {
    all: false,
    bill: {
      all: false,
      read: false,
      create: false,
      update: false,
      delete: false,
    },
    order: {
      all: false,
      read: false,
      create: false,
      update: false,
      delete: false,
    },
    return: {
      all: false,
      read: false,
      create: false,
      update: false,
      delete: false,
    },
    delivery: {
      all: false,
      read: false,
      create: false,
      update: false,
      delete: false,
    },
  },
  partner: {
    all: false,
    customer: {
      all: false,
      read: false,
      create: false,
      update: false,
      delete: false,
    },
    group_customer: {
      all: false,
      read: false,
      create: false,
      update: false,
      delete: false,
    },
    provider: {
      all: false,
      read: false,
      create: false,
      update: false,
      delete: false,
    },
    group_provider: {
      all: false,
      read: false,
      create: false,
      update: false,
      delete: false,
    },
    doctor: {
      all: false,
      read: false,
      create: false,
      update: false,
      delete: false,
    },
  },
  map: {
    all: false,
    read: false,
    create: false,
    update: false,
    delete: false,
  },
  cashbook: {
    all: false,
    read: false,
    create: false,
    update: false,
    delete: false,
  },

  report: {
    all: false,
    customer_report: {
      all: false,
      read: false,
      create: false,
      update: false,
      delete: false,
    },
    provider_report: {
      all: false,
      read: false,
      create: false,
      update: false,
      delete: false,
    },
    employee_report: {
      all: false,
      read: false,
      create: false,
      update: false,
      delete: false,
    },
    sale_report: {
      all: false,
      read: false,
      create: false,
      update: false,
      delete: false,
    },
    product_report: {
      all: false,
      read: false,
      create: false,
      update: false,
      delete: false,
    },
  },
  setting: {
    all: false,
    store: {
      all: false,
      read: false,
      create: false,
      update: false,
      delete: false,
    },
    branch: {
      all: false,
      read: false,
      create: false,
      update: false,
      delete: false,
    },
    employee: {
      all: false,
      read: false,
      create: false,
      update: false,
      delete: false,
    },
    role: {
      all: false,
      read: false,
      create: false,
      update: false,
      delete: false,
    },
    discount: {
      all: false,
      read: false,
      create: false,
      update: false,
      delete: false,
    },
    point_setting: {
      all: false,
      read: false,
      create: false,
      update: false,
      delete: false,
    },
    connect_system: {
      all: false,
      read: false,
      create: false,
      update: false,
      delete: false,
    },
    delivery_fee: {
      all: false,
      read: false,
      create: false,
      update: false,
      delete: false,
    },
    connect_delivery: {
      all: false,
      read: false,
      create: false,
      update: false,
      delete: false,
    },
  },
};
