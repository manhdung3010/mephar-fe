import { CustomModal } from "@/components/CustomModal";
import Image from "next/image";
import PhotographIcon from "@/assets/photograph.svg";
import { CustomRadio } from "@/components/CustomRadio";
import { useState } from "react";
import { CustomUploadExcelCustomer } from "@/components/CustomUploadExcelCustomer";

export function ImportFileCustomerModal({
  isOpen,
  onCancel,
}: {
  isOpen: boolean;
  onCancel: () => void;
}) {
  const [typeImport, setTypeImport] = useState("default");
  

  return (
    <CustomModal
      width={480}
      isOpen={isOpen}
      onCancel={onCancel}
      customFooter={true}
    >
      <div className="flex items-end">
        <CustomRadio
          className="-mr-4 flex"
          options={[
            { value: "default", label: "Nhập file hệ thống" },
          ]}
          onChange={(value) => setTypeImport(value)}
          value={typeImport}
        />
      </div>
      <CustomUploadExcelCustomer onCancel={onCancel} typeImport={typeImport}>
        <div
          className={
            "flex h-[300px] w-full flex-col items-center justify-center gap-[5px] rounded-lg border-2 border-dashed border-[#9CA1AD] p-5"
          }
        >
          <Image src={PhotographIcon} alt="Upload file" />
          <div className="font-semibold">
            <span className="text-[#E03]">Tải file lên</span>{" "}
            <span className="text-[#6F727A]">hoặc kéo và thả</span>
          </div>
          <div className="font-thin text-[#6F727A]">.XLSX, .XLS up to 2MB</div>
        </div>
      </CustomUploadExcelCustomer>
    </CustomModal>
  );
}
