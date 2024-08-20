import Image from 'next/image';
import { useState } from 'react';

import SampleProduct from '@/assets/images/product-sample.png';
import { CustomButton } from '@/components/CustomButton';
import { CustomInput } from '@/components/CustomInput';

import { SeriDetailModal } from './SeriDetailModal';
import { useRouter } from 'next/router';
import { useQuery } from '@tanstack/react-query';
import { getMarketOrderDetail } from '@/api/market.service';
import { getImage } from '@/helpers';
import { useRecoilValue } from 'recoil';
import { branchState } from '@/recoil/state';

export function ProcessOrder() {
  const router = useRouter();
  const branchId = useRecoilValue(branchState);
  const { id } = router.query;
  const [openSeriDetailModal, setOpenSeriDetailModal] = useState(false);
  const [orderInfo, setOrderInfo] = useState<any>(null);

  const { data: orderDetail, isLoading } = useQuery(
    ['MAKET_ORDER_ORDER_DETAIL', id],
    () => getMarketOrderDetail(id as string, branchId as string),
    {
      enabled: !!id,
      onSuccess: (res) => {
        setOrderInfo(res?.data?.item);
      }
    }
  );

  return (
    <>
      <div className="mt-6 flex items-center justify-between bg-white p-5">
        <div className="text-2xl font-medium uppercase">Xử lý đơn hàng</div>
        <div className="flex gap-4">
          <CustomButton outline={true}>Quay lại</CustomButton>
          <CustomButton>Lưu</CustomButton>
          <CustomButton type="success">Xử lý xong</CustomButton>
        </div>
      </div>

      <div className="bg-white p-5">
        <div className="mb-5 font-semibold text-[#232325] uppercase">
          MÃ ĐƠN HÀNG:{' '}
          <span className=" font-semibold text-[#0070F4]">{orderInfo?.code}</span>
        </div>

        <div className="mb-5 text-[#A3A8AF]">
          Người mua: <span className="ml-4 text-[#0F1824]">{orderInfo?.branch?.store?.name}</span>
        </div>

        <div className="mb-5 font-semibold text-[#232325] uppercase">sản phẩm (3)</div>

        {
          orderInfo?.products?.map((product, index) => (
            <div className="mb-5 flex items-center gap-3" key={product.id}>
              <div className='border border-[#d7d8e1] rounded-xl w-20 h-20 overflow-hidden'>
                <Image className=' object-cover' src={getImage(product?.marketProduct?.imageCenter?.path)} width={80} height={80} alt="" />
              </div>
              <div className="grow">
                <div
                  className="mb-2 cursor-pointer font-medium text-[#333]"
                  onClick={() => setOpenSeriDetailModal(true)}
                >
                  {product?.marketProduct?.product?.name}
                </div>
                <div className="font-medium text-[#FF8800]">Đã thêm: {product?.series?.length}/{product?.quantity}</div>
              </div>
              <div className="w-[360px]">
                <div className="mb-2 text-[#A3A8AF]">Nhập seri để thêm:</div>
                <CustomInput className="h-12" onChange={() => { }} />
              </div>
            </div>
          ))
        }
      </div>

      <SeriDetailModal
        isOpen={openSeriDetailModal}
        onCancel={() => setOpenSeriDetailModal(false)}
      />
    </>
  );
}
