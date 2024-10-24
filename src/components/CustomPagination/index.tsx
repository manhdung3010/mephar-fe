import type { PaginationProps } from "antd";
import { Pagination } from "antd";

import { CustomSelect } from "../CustomSelect";
import { PaginationStyled } from "./styled";

/**
 * CustomPagination component renders a pagination control with custom item rendering
 * for previous and next buttons, and a select dropdown for page size.
 *
 * @param {number} page - The current page number.
 * @param {number} pageSize - The number of items per page.
 * @param {number} total - The total number of items.
 * @param {(value: number) => void} [setPage] - Function to set the current page.
 * @param {(value: number) => void} [setPerPage] - Function to set the number of items per page.
 *
 * @returns {JSX.Element} The rendered pagination component.
 */
export default function CustomPagination({
  page,
  pageSize,
  total,
  setPage = () => {},
  setPerPage = () => {},
}: {
  page: number;
  pageSize: number;
  total: number;
  setPage?: (value: number) => void;
  setPerPage?: (value: number) => void;
}) {
  const itemRender: PaginationProps["itemRender"] = (_, type, originalElement) => {
    if (type === "prev") {
      return (
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none">
          <path
            d="M14.298 5.98828L8.28796 11.9983L14.298 18.0083L15.712 16.5943L11.116 11.9983L15.712 7.40228L14.298 5.98828Z"
            fill="#E8EAEB"
          />
        </svg>
      );
    }
    if (type === "next") {
      return (
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none">
          <path
            d="M9.70209 18.0102L15.7121 12.0002L9.70209 5.99023L8.28809 7.40423L12.8841 12.0002L8.28809 16.5962L9.70209 18.0102Z"
            fill="#E8EAEB"
          />
        </svg>
      );
    }
    return originalElement;
  };

  return (
    <PaginationStyled className={`flex items-center justify-end gap-x-3  rounded-b-xl bg-white px-6 py-4`}>
      <div className="flex items-center gap-x-3">
        <div>Hiển thị</div>

        <CustomSelect
          value={pageSize}
          wrapClassName="!w-[100px]"
          className=" !rounded"
          options={[
            { value: 10, label: "10" },
            { value: 20, label: "20" },
            { value: 50, label: "50" },
            { value: 100, label: "100" },
          ]}
          onChange={(value) => {
            setPerPage(value);
          }}
        />

        <div>
          <span className="mr-5">kết quả</span> Từ {(page - 1) * pageSize + 1} đến{" "}
          {page * pageSize > total ? total : page * pageSize} trên tổng {total}
        </div>
      </div>

      <Pagination
        current={page}
        total={total}
        pageSize={pageSize}
        itemRender={itemRender}
        showQuickJumper={false}
        onChange={(value) => setPage(value)}
      />
    </PaginationStyled>
  );
}
