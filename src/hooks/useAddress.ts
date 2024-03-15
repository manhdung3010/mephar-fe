import { useQuery } from '@tanstack/react-query';

import { getDistricts, getProvinces, getWards } from '@/api/address.service';

export function useAddress(provinceId?: number, districtId?: number) {
  const { data: provinces } = useQuery(['PROVINCES'], () => getProvinces());

  const { data: districts } = useQuery(
    ['DISTRICTS', provinceId],
    () => getDistricts(Number(provinceId)),
    {
      enabled: !!provinceId,
    }
  );

  const { data: wards } = useQuery(
    ['WARDS', provinceId, districtId],
    () => getWards(Number(provinceId), Number(districtId)),
    { enabled: !!provinceId && !!districtId }
  );

  return { provinces, districts, wards };
}
