import { CustomUnitSelect } from '@/components/CustomUnitSelect'
import React, { useEffect, useState } from 'react'

function ListUnit({ data, onChangeUnit }) {

  const [unitValue, setUnitValue] = useState<number | undefined>(undefined)

  useEffect(() => {
    setUnitValue(data?.find((unit) => unit.isBaseUnit)?.id || data[0]?.id)
  }, [data])

  const handleChangeUnit = (value) => {
    setUnitValue(value)
    onChangeUnit(value)
  }

  return (
    <CustomUnitSelect
      options={data?.map((item) => ({
        value: item.id,
        label: item.unitName,
      }))}
      value={
        data?.filter((unit) => unit.id === unitValue).map((item) => (
          {
            value: item.id,
            label: item.unitName,
          }
        ))
      }
      onChange={(value) => handleChangeUnit(value)}
    />
  )
}

export default ListUnit