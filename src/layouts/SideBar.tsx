import type { MenuProps } from 'antd';
import { Button, Menu } from 'antd';
import Image from 'next/image';
import { useRouter } from 'next/router';
import React, { useEffect, useState } from 'react';
import { useRecoilState, useRecoilValue } from 'recoil';

import CashbookIcon from '@/assets/cashbookIcon.svg';
import HomeIcon from '@/assets/homeIcon1.svg';
import MarketIcon from '@/assets/marketIcon.svg';
import MedicineIcon from '@/assets/medicine.svg';
import PartnerIcon from '@/assets/partner.svg';
import ProductIcon from '@/assets/productIcon.svg';
import ReportIcon from '@/assets/reportIcon.svg';
import SellIcon from '@/assets/sellIcon.svg';
import SettingIcon from '@/assets/settingIcon.svg';
import TransactionIcon from '@/assets/transactionIcon.svg';
import { hasMultiplePermission, hasPermission } from '@/helpers';
import { RoleModel } from '@/modules/settings/role/role.enum';
import Logo from '@/public/logo.png';
import BarIcon from '@/assets/barIcon.svg';
import { collapsedState, profileState } from '@/recoil/state';

import { SideBarStyled } from './styled';

type MenuItem = Required<MenuProps>['items'][number];

function getItem(
  label: React.ReactNode,
  key: React.Key,
  icon?: React.ReactNode,
  children?: any,
  type?: 'group'
): MenuItem {
  return {
    key,
    icon,
    children,
    label,
    type,
  } as MenuItem;
}

export const productGroup = {
  PRODUCT_LIST: '/products/list',
  PRODUCT_MEDICINE_SAMPLE: '/products/sample-medicine',
  PRODUCT_ADD_MEDICINE_SAMPLE: '/products/sample-medicine/add-sample-medicine',

  PRODUCT_IMPORT: '/products/import',
  PRODUCT_IMPORT_COUPON: '/products/import/coupon',

  PRODUCT_RETURN: '/products/return',
  PRODUCT_RETURN_COUPON: '/products/return/coupon',

  PRODUCT_CHECK: '/products/check-inventory',
  PRODUCT_CHECK_COUPON: '/products/check-inventory/coupon',

  PRODUCT_PRICE: '/products/price-setting',
};

export const transactionGroup = {
  BILL: '/transactions/bill',
  ORDER: '/transactions/order',
  PROCESS_ORDER: '/transactions/order/process-order',
  RETURN: '/transactions/return',
  DELIVERY: '/transactions/delivery',
  DELIVERY_COUPON: '/transactions/delivery/coupon',
};

export const marketGroup = {
  MARKET_COMMON: '/markets/common',
  MARKET_STORE: '/markets/store',
  MARKET_SETTING: '/markets/setting',
  MARKET_ADD_SETTING: '/markets/add-setting',
};

export const partnerGroup = {
  PARTNERS_CUSTOMER: '/partners/customer',
  PARTNERS_ADD_CUSTOMER: '/partners/customer/add-customer',
  PARTNERS_GROUP_CUSTOMER: '/partners/group-customer',
  PARTNERS_PROVIDER: '/partners/provider',
  PARTNERS_GROUP_PROVIDER: '/partners/group-provider',
  PARTNERS_DOCTOR_LIST: '/partners/doctor',
};

export const reportGroup = {
  REPORTS_CUSTOMER: '/reports/customer-report',
  REPORTS_EMPLOYEE: '/reports/employee-report',
  REPORTS_PROVIDER: '/reports/provider-report',
  REPORTS_SALE: '/reports/sale-report',
  REPORTS_PRODUCT: '/reports/product-report',
};

const settingGroup = {
  SETTING_STORE: '/settings/store',
  SETTING_BRANCH: '/settings/branch',
  SETTING_ADD_BRANCH: '/settings/branch/add-branch',
  SETTING_EMPLOYEE: '/settings/employee',
  SETTING_ADD_EMPLOYEE: '/settings/employee/add-employee',
  SETTING_ROLE: '/settings/role',
  SETTING_ADD_ROLE: '/settings/employee/add-role',
  SETTING_DISCOUNT: '/settings/discount',
  SETTING_ADD_DISCOUNT: '/settings/discount/add-discount',
  SETTING_COLLECT_POINT: '/settings/collect-point',
  SETTING_CONNECT_SYSTEM: '/settings/connect-system',
  SETTING_DELIVERY: '/settings/delivery-fee',
  SETTING_DELIVERY_FEE: '/settings/delivery-fee/setting-fee',
  SETTING_CONNECT_DELIVERY: '/settings/connect-delivery',
};

const keyMenu = {
  HOME: '/',
  SALE: '/sales',

  PRODUCT: '/products',
  ...productGroup,

  MARKET: '/markets',
  ...marketGroup,

  MEDICINE: '/medicines',
  TRANSACTION: '/transactions',
  ...transactionGroup,

  PARTNER: '/partners',
  ...partnerGroup,

  CASHBOOK: '/cashbooks',

  REPORT: '/reports',
  ...reportGroup,

  SETTING: '/settings',
  ...settingGroup,
};

const items = (permissions: { model: string; action: string }[]) => [
  hasPermission(permissions, RoleModel.home) &&
  getItem('Tổng quan', keyMenu.HOME, <Image src={HomeIcon} />),

  hasPermission(permissions, RoleModel.sale) &&
  getItem('Bán hàng', keyMenu.SALE, <Image src={SellIcon} />),

  hasMultiplePermission(permissions, [
    RoleModel.list_product,
    RoleModel.import_product,
    RoleModel.return_product,
    RoleModel.check_inventory,
    RoleModel.price_setting,
  ]) &&
  getItem('Sản phẩm', keyMenu.PRODUCT, <Image src={ProductIcon} />, [
    hasPermission(permissions, RoleModel.list_product) &&
    getItem('Danh sách sản phẩm', keyMenu.PRODUCT_LIST),
    hasPermission(permissions, RoleModel.list_product) &&
    getItem('Danh sách đơn thuốc mẫu', keyMenu.PRODUCT_MEDICINE_SAMPLE),
    hasPermission(permissions, RoleModel.import_product) &&
    getItem('Nhập sản phẩm', keyMenu.PRODUCT_IMPORT),
    hasPermission(permissions, RoleModel.return_product) &&
    getItem('Trả hàng nhập', keyMenu.PRODUCT_RETURN),
    hasPermission(permissions, RoleModel.check_inventory) &&
    getItem('Kiểm kho', keyMenu.PRODUCT_CHECK),
    hasPermission(permissions, RoleModel.price_setting) &&
    getItem('Thiết lập giá', keyMenu.PRODUCT_PRICE),
  ]),

  hasMultiplePermission(permissions, [
    RoleModel.market_common,
    RoleModel.market_store,
    RoleModel.market_setting,
  ]) &&
  getItem('Chợ', keyMenu.MARKET, <Image src={MarketIcon} />, [
    hasPermission(permissions, RoleModel.market_common) &&
    getItem('Chợ', keyMenu.MARKET_COMMON),
    hasPermission(permissions, RoleModel.market_store) &&
    getItem('Chợ đại lý', keyMenu.MARKET_STORE),
    hasPermission(permissions, RoleModel.market_setting) &&
    getItem('Cấu hình sản phẩm', keyMenu.MARKET_SETTING),
  ]),

  hasPermission(permissions, RoleModel.medicine_category) &&
  getItem('Danh mục thuốc', keyMenu.MEDICINE, <Image src={MedicineIcon} />),

  hasMultiplePermission(permissions, [
    RoleModel.bill,
    RoleModel.order,
    RoleModel.return,
    RoleModel.delivery,
  ]) &&
  getItem('Giao dịch', keyMenu.TRANSACTION, <Image src={TransactionIcon} />, [
    hasPermission(permissions, RoleModel.bill) &&
    getItem('Hóa đơn', keyMenu.BILL),
    hasPermission(permissions, RoleModel.order) &&
    getItem('Đơn hàng', keyMenu.ORDER),
    hasPermission(permissions, RoleModel.return) &&
    getItem('Trả hàng', keyMenu.RETURN),
    hasPermission(permissions, RoleModel.delivery) &&
    getItem('Chuyển hàng', keyMenu.DELIVERY),
  ]),

  hasMultiplePermission(permissions, [
    RoleModel.customer,
    RoleModel.group_customer,
    RoleModel.provider,
    RoleModel.group_provider,
    RoleModel.doctor,
  ]) &&
  getItem('Đối tác', keyMenu.PARTNER, <Image src={PartnerIcon} />, [
    hasPermission(permissions, RoleModel.customer) &&
    getItem('Khách hàng', keyMenu.PARTNERS_CUSTOMER),
    hasPermission(permissions, RoleModel.group_customer) &&
    getItem('Nhóm khách hàng', keyMenu.PARTNERS_GROUP_CUSTOMER),
    hasPermission(permissions, RoleModel.provider) &&
    getItem('Nhà cung cấp', keyMenu.PARTNERS_PROVIDER),
    hasPermission(permissions, RoleModel.group_provider) &&
    getItem('Nhóm nhà cung cấp', keyMenu.PARTNERS_GROUP_PROVIDER),
    hasPermission(permissions, RoleModel.doctor) &&
    getItem('Bác sĩ', keyMenu.PARTNERS_DOCTOR_LIST),
  ]),

  hasPermission(permissions, RoleModel.cashbook) &&
  getItem('Sổ quỹ', keyMenu.CASHBOOK, <Image src={CashbookIcon} />),

  hasMultiplePermission(permissions, [
    RoleModel.customer_report,
    RoleModel.provider_report,
    RoleModel.employee_report,
    RoleModel.sale_report,
    RoleModel.product_report,
  ]) &&
  getItem('Báo cáo', keyMenu.REPORT, <Image src={ReportIcon} />, [
    hasPermission(permissions, RoleModel.customer_report) &&
    getItem('Báo cáo khách hàng', keyMenu.REPORTS_CUSTOMER),
    hasPermission(permissions, RoleModel.provider_report) &&
    getItem('Báo cáo nhà cung cấp', keyMenu.REPORTS_PROVIDER),
    hasPermission(permissions, RoleModel.employee_report) &&
    getItem('Báo cáo nhân viên', keyMenu.REPORTS_EMPLOYEE),
    hasPermission(permissions, RoleModel.sale_report) &&
    getItem('Báo cáo bán hàng', keyMenu.REPORTS_SALE),
    hasPermission(permissions, RoleModel.product_report) &&
    getItem('Báo cáo sản phẩm', keyMenu.REPORTS_PRODUCT),
  ]),

  hasMultiplePermission(permissions, [
    RoleModel.store,
    RoleModel.branch,
    RoleModel.employee,
    RoleModel.role,
    RoleModel.discount,
    RoleModel.point_setting,
    RoleModel.connect_system,
    RoleModel.delivery_fee,
    RoleModel.connect_system,
  ]) && getItem('Cấu hình', keyMenu.SETTING, <Image src={SettingIcon} />),
];

const SideBar = () => {
  const router = useRouter();

  const profile = useRecoilValue(profileState);
  const [collapsedVal, setCollapsedVal] = useRecoilState(collapsedState);

  const [menuActive, setMenuActive] = useState<any>([]);
  const [menu, setMenu] = useState<any>([]);

  useEffect(() => {
    if (profile) {
      setMenu(items(profile?.role?.permissions));
    }
  }, [profile]);

  useEffect(() => {
    if (!router.pathname) return;

    const originPath = router.pathname;
    const menuActive: any = [];

    if (originPath === keyMenu.HOME) {
      setMenuActive([keyMenu.HOME]);
      return;
    }

    Object.values(keyMenu).forEach((path: string) => {
      if (originPath.startsWith(path) && path !== keyMenu.HOME) {
        menuActive.push(path);
      }
    });

    setMenuActive(menuActive);
  }, [router.pathname]);

  return (
    <SideBarStyled
      // style={{ width: 230, minWidth: 230 }}
      className={`h-screen min-h-screen overflow-y-auto bg-[#182537] ${collapsedVal ? "" : "pr-5"}`}
    >
      <div className={`flex items-center ${collapsedVal ? "justify-center" : "justify-between"} py-3 px-4`}>
        {!collapsedVal && (<Image src={Logo} alt="Logo" />)}
        <Image src={BarIcon} className='cursor-pointer' onClick={() => setCollapsedVal(!collapsedVal)} alt="bar-icon" />
      </div>

      <div className="mb-2 h-[1px] w-full bg-[#263D53]" />
      <Menu
        selectedKeys={menuActive}
        openKeys={menuActive}
        mode="inline"
        theme="dark"
        items={menu}
        style={{ width: collapsedVal ? 80 : 230 }}
        inlineCollapsed={collapsedVal}
        onSelect={({ selectedKeys }) => {
          router.push(selectedKeys[0] as string);

          setMenuActive(selectedKeys);
        }}
        onOpenChange={(value) => {
          setMenuActive(value);
        }}
        onClick={({ key }) => {
          router.push(key);
        }}
      />
    </SideBarStyled>
  );
};

export default SideBar;
