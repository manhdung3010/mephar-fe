import { Checkbox, Select } from "antd";

import { CustomDatePicker } from "@/components/CustomDatePicker";
import Label from "@/components/CustomLabel";
import { CustomSelect } from "@/components/CustomSelect";
import InputError from "@/components/InputError";
import dayjs from "dayjs";
import { useEffect, useState } from "react";

const dayWeekOptions = [
  {
    value: 2,
    label: "Thứ 2",
  },
  {
    value: 3,
    label: "Thứ 3",
  },
  {
    value: 4,
    label: "Thứ 4",
  },
  {
    value: 5,
    label: "Thứ 5",
  },
  {
    value: 6,
    label: "Thứ 6",
  },
  {
    value: 7,
    label: "Thứ 7",
  },
  {
    value: 1,
    label: "Chủ nhật",
  },
];
const monthOptions = [
  {
    value: 1,
    label: "Tháng 1",
  },
  {
    value: 2,
    label: "Tháng 2",
  },
  {
    value: 3,
    label: "Tháng 3",
  },
  {
    value: 4,
    label: "Tháng 4",
  },
  {
    value: 5,
    label: "Tháng 5",
  },
  {
    value: 6,
    label: "Tháng 6",
  },
  {
    value: 7,
    label: "Tháng 7",
  },
  {
    value: 8,
    label: "Tháng 8",
  },
  {
    value: 9,
    label: "Tháng 9",
  },
  {
    value: 10,
    label: "Tháng 10",
  },
  {
    value: 11,
    label: "Tháng 11",
  },
  {
    value: 12,
    label: "Tháng 12",
  },
];

const dayOptions = [
  {
    value: 1,
    label: "Ngày 1",
  },
  {
    value: 2,
    label: "Ngày 2",
  },
  {
    value: 3,
    label: "Ngày 3",
  },
  {
    value: 4,
    label: "Ngày 4",
  },
  {
    value: 5,
    label: "Ngày 5",
  },
  {
    value: 6,
    label: "Ngày 6",
  },
  {
    value: 7,
    label: "Ngày 7",
  },
  {
    value: 8,
    label: "Ngày 8",
  },
  {
    value: 9,
    label: "Ngày 9",
  },
  {
    value: 10,
    label: "Ngày 10",
  },
  {
    value: 11,
    label: "Ngày 11",
  },
  {
    value: 12,
    label: "Ngày 12",
  },
  {
    value: 13,
    label: "Ngày 13",
  },
  {
    value: 14,
    label: "Ngày 14",
  },
  {
    value: 15,
    label: "Ngày 15",
  },
  {
    value: 16,
    label: "Ngày 16",
  },
  {
    value: 17,
    label: "Ngày 17",
  },
  {
    value: 18,
    label: "Ngày 18",
  },
  {
    value: 19,
    label: "Ngày 19",
  },
  {
    value: 20,
    label: "Ngày 20",
  },
  {
    value: 21,
    label: "Ngày 21",
  },
  {
    value: 22,
    label: "Ngày 22",
  },
  {
    value: 23,
    label: "Ngày 23",
  },
  {
    value: 24,
    label: "Ngày 24",
  },
  {
    value: 25,
    label: "Ngày 25",
  },
  {
    value: 26,
    label: "Ngày 26",
  },
  {
    value: 27,
    label: "Ngày 27",
  },
  {
    value: 28,
    label: "Ngày 28",
  },
  {
    value: 29,
    label: "Ngày 29",
  },
  {
    value: 30,
    label: "Ngày 30",
  },
  {
    value: 31,
    label: "Ngày 31",
  },
];

const hourOptions = [
  {
    value: 0,
    label: "00h",
  },
  {
    value: 1,
    label: "01h",
  },
  {
    value: 2,
    label: "02h",
  },
  {
    value: 3,
    label: "03h",
  },
  {
    value: 4,
    label: "04h",
  },
  {
    value: 5,
    label: "05h",
  },
  {
    value: 6,
    label: "06h",
  },
  {
    value: 7,
    label: "07h",
  },
  {
    value: 8,
    label: "08h",
  },
  {
    value: 9,
    label: "09h",
  },
  {
    value: 10,
    label: "10h",
  },
  {
    value: 11,
    label: "11h",
  },
  {
    value: 12,
    label: "12h",
  },
  {
    value: 13,
    label: "13h",
  },
  {
    value: 14,
    label: "14h",
  },
  {
    value: 15,
    label: "15h",
  },
  {
    value: 16,
    label: "16h",
  },
  {
    value: 17,
    label: "17h",
  },
  {
    value: 18,
    label: "18h",
  },
  {
    value: 19,
    label: "19h",
  },
  {
    value: 20,
    label: "20h",
  },
  {
    value: 21,
    label: "21h",
  },
  {
    value: 22,
    label: "22h",
  },
  {
    value: 23,
    label: "23h",
  },
];

const TimeApplication = ({ setValue, getValues, errors }: any) => {
  const [times, setTimes] = useState({
    dateFrom: getValues("time")?.dateFrom || "",
    dateTo: getValues("time")?.dateTo || "",
    byDay: getValues("time")?.byDay || [],
    byMonth: getValues("time")?.byMonth || [],
    byHour: getValues("time")?.byHour || [],
    byWeekDay: getValues("time")?.byWeekDay || [],
    isWarning: getValues("time")?.isWarning || false,
    isBirthday: getValues("time")?.isBirthday || false,
  });

  const handleChange = (key, value) => {
    const timesFormat = {
      ...times,
      [key]: value,
    };
    setTimes(timesFormat);
    setValue("time", timesFormat, { shouldValidate: true });
  };

  console.log('getValues("time")', getValues("time"));

  return (
    <div className="mt-5">
      <div className="mb-5 grid grid-cols-2 gap-x-[42px] gap-y-5">
        <div>
          <Label label="Thời gian" required />
          <div className="grid grid-cols-2 gap-2">
            <div>
              <CustomDatePicker
                showTime
                placeholder="Chọn ngày"
                className="h-10"
                onChange={(value) => handleChange("dateFrom", dayjs(value).format("YYYY-MM-DD HH:mm:ss"))}
                value={getValues("time")?.dateFrom}
              />
              <InputError error={errors?.time?.dateFrom?.message} />
            </div>
            <div>
              <CustomDatePicker
                showTime
                placeholder="Chọn ngày"
                className="h-10"
                onChange={(value) => handleChange("dateTo", dayjs(value).format("YYYY-MM-DD HH:mm:ss"))}
                value={getValues("time")?.dateTo}
              />
              <InputError error={errors?.time?.dateTo?.message} />
            </div>
          </div>
        </div>

        <div>
          <Label infoText="" label="Theo thứ" />
          <Select
            mode="multiple"
            className="!rounded w-full"
            placeholder="Chọn thứ"
            optionFilterProp="label"
            showSearch
            onChange={(value) => handleChange("byWeekDay", value)}
            value={getValues("time")?.byWeekDay}
            options={dayWeekOptions}
            size="large"
          />
        </div>

        <div>
          <Label infoText="" label="Theo tháng" />
          <Select
            mode="multiple"
            className="!rounded w-full"
            placeholder="Chọn tháng"
            onChange={(value) => handleChange("byMonth", value)}
            value={getValues("time")?.byMonth}
            optionFilterProp="label"
            showSearch
            options={monthOptions}
            size="large"
          />
        </div>

        <div>
          <Label infoText="" label="Theo ngày" />
          <Select
            mode="multiple"
            className="!rounded w-full"
            placeholder="Chọn ngày"
            onChange={(value) => handleChange("byDay", value)}
            value={getValues("time")?.byDay}
            options={dayOptions}
            optionFilterProp="label"
            showSearch
            size="large"
          />
        </div>
        <div>
          <Label infoText="" label="Theo giờ" />
          <Select
            mode="multiple"
            className="!rounded w-full"
            placeholder="Chọn giờ"
            onChange={(value) => handleChange("byHour", value)}
            value={getValues("time")?.byHour}
            options={hourOptions}
            optionFilterProp="label"
            showSearch
            size="large"
          />
        </div>
      </div>
      <div className="grid grid-cols-2 gap-x-[42px] gap-y-5">
        <div className="flex gap-2">
          <Checkbox
            checked={getValues("time")?.isBirthday}
            onChange={(e) => handleChange("isBirthday", e.target.checked)}
          />
          <div className="flex items-center gap-2">
            <div>Áp dụng vào</div>
            ngày
            <div>sinh nhật của khách hàng</div>
          </div>
        </div>

        <div className="flex gap-2">
          <Checkbox
            checked={getValues("time")?.isWarning}
            onChange={(e) => handleChange("isWarning", e.target.checked)}
          />
          <div className="flex items-center gap-2">
            <CustomSelect
              onChange={() => {}}
              className="border-underline"
              wrapClassName="!w-[120px]"
              placeholder="Cảnh báo"
            />
            <div className="text-[#8F90A6]">(Nếu khách hàng đã được hưởng khuyến mại này)</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TimeApplication;
