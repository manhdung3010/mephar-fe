import { Switch } from 'antd';
import styled from 'styled-components';

export const CustomSwitch = styled(Switch)`
  &.ant-switch-checked {
    background-color: #d64457;
  }
    &.ant-switch:hover {
        background-color: #d64457 !important;}
    &.ant-switch:not(.ant-switch-checked) {
        background-color: #ccc;
    }
`;