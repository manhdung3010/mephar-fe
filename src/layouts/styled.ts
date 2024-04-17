import styled from "styled-components";

export const SideBarStyled = styled.div`
  .sidebar-logo {
  }

  &::-webkit-scrollbar-track {
    -webkit-box-shadow: inset 0 0 6px rgba(0, 0, 0, 0.3);
    border-radius: 10px;
    background-color: #f5f5f5;
    visibility: hidden;
  }

  &::-webkit-scrollbar {
    width: 0px;
    background-color: #f5f5f5;
    visibility: hidden;
  }

  &::-webkit-scrollbar-thumb {
    border-radius: 10px;
    -webkit-box-shadow: inset 0 0 6px rgba(0, 0, 0, 0.3);
    visibility: hidden;
  }

  .ant-menu {
    background: #182537 !important;
  }

  .ant-menu > .ant-menu-item {
    padding: 16px !important;
    height: unset !important;
    line-height: 1 !important;
  }

  .ant-menu > .ant-menu-submenu > .ant-menu-submenu-title {
    padding: 16px !important;
    height: unset !important;
    line-height: 1 !important;
    border-radius: 3px;

    .ant-menu-title-content {
      color: #f3f4f5;
    }
  }

  .ant-menu-submenu > .ant-menu-sub > .ant-menu-item {
    padding: 8px 18px !important;
    border-radius: 3px;

    .ant-menu-title-content {
      margin-left: 32px;
    }
  }

  .ant-menu-item > .ant-menu-title-content {
    overflow: unset;
    white-space: normal;
    line-height: 24px;
    color: #f3f4f5;
  }

  .ant-menu-root > .ant-menu-item-selected {
    background: #d64457 !important;
    color: #ffffff !important;
    font-weight: 600;
    border-radius: 3px;
  }

  .ant-menu-submenu > .ant-menu-sub > .ant-menu-item-selected {
    background: transparent;

    .ant-menu-title-content {
      color: #d64457;
    }
  }

  .ant-menu-submenu-selected > .ant-menu-submenu-title {
    background: #d64457 !important;
    color: #ffffff !important;
    font-weight: 600;
  }
  .ant-menu-inline-collapsed .ant-menu-title-content {
    display: none;
  }
  .ant-menu-inline-collapsed .ant-menu-submenu-title {
    display: flex;
    justify-content: center;
  }
  .ant-menu-item,
  .ant-menu-submenu-title {
    display: flex;
    gap: 10px;
  }

  .ant-menu-inline-collapsed .ant-menu-item {
    justify-content: center;
  }
`;
