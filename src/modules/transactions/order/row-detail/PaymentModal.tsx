import { createPaymentOrder } from '@/api/market.service';
import { CustomButton } from '@/components/CustomButton';
import { CustomInput } from '@/components/CustomInput';
import Label from '@/components/CustomLabel';
import { CustomModal } from '@/components/CustomModal'
import { formatMoney } from '@/helpers';
import { branchState } from '@/recoil/state';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { message } from 'antd';
import React from 'react'
import { useRecoilValue } from 'recoil';

function PaymentModal({
  isOpen,
  onCancel,
  id,
  totalMoney,
}: {
  isOpen: boolean;
  onCancel: () => void;
  id: string;
  totalMoney: number;
}) {
  const branchId = useRecoilValue(branchState);
  const queryClient = useQueryClient();
  const [paymentValue, setPaymentValue] = React.useState(0);

  const {
    mutate: mutatePayment,
    isLoading: isLoading,
  } = useMutation(() => {
    const payload = {
      paid: paymentValue,
    };
    return createPaymentOrder(id, payload);
  }, {
    onSuccess: async () => {
      await queryClient.invalidateQueries(['MAKET_ORDER']);
      onCancel();
    },
    onError: (err: any) => {
      message.error(err?.message);
    },
  });

  const onSubmit = () => {
    if (paymentValue <= 0) {
      message.error('Số tiền thanh toán phải lớn hơn 0');
      return;
    }
    if (paymentValue > totalMoney) {
      message.error('Số tiền thanh toán không được lớn hơn số tiền cần thanh toán');
      return;
    }
    mutatePayment();
  }

  return (
    <CustomModal
      title="Thanh toán hóa đơn"
      isOpen={isOpen}
      onCancel={onCancel}
      width={600}
      customFooter={true}
    >
      <div className='my-5'>
        <Label infoText="" label={`Số tiền thanh toán (${formatMoney(totalMoney)})`} required />
        <CustomInput className='!h-11' value={paymentValue} type='number' onChange={(value) => {
          setPaymentValue(+value);
        }} />
      </div>
      <CustomButton className="ml-auto !h-11 !w-[120px] mt-3" onClick={onSubmit} loading={isLoading} disabled={isLoading}>
        Thanh toán
      </CustomButton>
    </CustomModal>
  )
}

export default PaymentModal