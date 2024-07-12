import { CustomUnitSelect } from "@/components/CustomUnitSelect";
import React, { useEffect, useState } from "react";
import { IProduct } from "./types";

function ListUnit({
  data,
  onChangeUnit,
  record,
  isDetailOpen,
}: {
  data: any;
  onChangeUnit: any;
  record: IProduct;
  isDetailOpen: boolean;
}) {
  const [unitValue, setUnitValue] = useState<number | undefined>(undefined);

  useEffect(() => {
    setUnitValue(data?.find((unit) => unit.isBaseUnit)?.id || data[0]?.id);
  }, [data]);

  const handleChangeUnit = (value) => {
    setUnitValue(value);
    onChangeUnit(value);
  };

  return (
    <CustomUnitSelect
      options={data?.map((item) => ({
        value: item.id,
        label: item.unitName,
      }))}
      value={
        isDetailOpen
          ? data
              ?.filter((unit) => unit.id === record?.unitId)
              .map((item) => ({
                value: item.id,
                label: item.unitName,
              }))
          : data
              ?.filter((unit) => unit.id === unitValue)
              .map((item) => ({
                value: item.id,
                label: item.unitName,
              }))
      }
      onChange={(value) => handleChangeUnit(value)}
    />
  );
}

export default ListUnit;
