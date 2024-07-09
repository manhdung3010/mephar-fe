import React from 'react'
import Image from 'next/image';
import DateIcon from '@/assets/dateIcon.svg';
import MarkIcon from '@/assets/markIcon.svg';

function TripCard() {
  return (
    <div className="w-full mx-auto bg-white shadow-md rounded-lg overflow-hidden">
      <div className="p-4 border-b border-gray-200 flex justify-between items-center">
        <h2 className="text-lg font-semibold">TIẾP THỊ SẢN PHẨM ĐIỀU TRỊ VIÊM GAN ABC</h2>
        <button className="text-blue-600 bg-blue-100 rounded-full px-3 py-1 text-sm">Đang tiến hành</button>
      </div>
      <div className="p-4 border-b border-gray-200">
        <div className="flex items-center text-gray-600 space-x-4">
          <div className="flex items-center space-x-1">
            <Image src={DateIcon} alt="" />
            <span>12/07/2024</span>
          </div>
          <div className="flex items-center space-x-1">
            <Image src={MarkIcon} alt="" />
            <span>4 điểm đến</span>
          </div>
        </div>
      </div>
      <div className="p-4 flex items-start space-x-4">
        <div className="flex items-center justify-center w-10 h-10 rounded-full bg-blue-500 text-white">
          3
        </div>
        <div className="flex-1">
          <div className="flex justify-between items-center">
            <div className="font-semibold text-lg text-blue-700">KH78946 - Nguyễn Đình Luân</div>
            <span className="text-purple-600 bg-purple-200 rounded-full px-2 py-1 text-xs">Tiềm năng</span>
          </div>
          <div className="text-gray-600 mt-2">
            <div className="flex items-center space-x-2">
              <i className="fas fa-phone-alt"></i>
              <span>(+855) 445 551 048</span>
            </div>
            <div className="flex items-center space-x-2 mt-1">
              <i className="fas fa-map-marker-alt"></i>
              <span>69 Trần Quốc Hoàn</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default TripCard