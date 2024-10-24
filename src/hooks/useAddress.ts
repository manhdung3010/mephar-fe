import { useQuery } from "@tanstack/react-query";

import { getDistricts, getProvinces, getWards } from "@/api/address.service";

/**
 * Custom hook to fetch and return address data including provinces, districts, and wards.
 *
 * @param {number} [provinceId] - Optional ID of the province to fetch districts and wards.
 * @param {number} [districtId] - Optional ID of the district to fetch wards.
 * @returns {Object} - An object containing the fetched provinces, districts, and wards data.
 * @returns {Array} provinces - List of provinces.
 * @returns {Array} districts - List of districts based on the provided provinceId.
 * @returns {Array} wards - List of wards based on the provided provinceId and districtId.
 */
export function useAddress(provinceId?: number, districtId?: number) {
  const { data: provinces } = useQuery(["PROVINCES"], () => getProvinces());

  const { data: districts } = useQuery(["DISTRICTS", provinceId], () => getDistricts(Number(provinceId)), {
    enabled: !!provinceId,
  });

  const { data: wards } = useQuery(
    ["WARDS", provinceId, districtId],
    () => getWards(Number(provinceId), Number(districtId)),
    { enabled: !!provinceId && !!districtId },
  );

  return { provinces, districts, wards };
}
