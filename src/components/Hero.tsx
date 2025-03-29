"use client";
import React from "react";

export default function Hero() {
  return (
    <section className="py-6 lg:py-20 bg-[#022E41]">
      <div className="container mx-auto px-4">
        <h2 className="text-[47px] font-normal text-center text-white ">
          גן עדן פיננסי
        </h2>
        <p className="mt-4 text-center text-[26px] text-white">
          הבית שלך לחדשות ועדכונים חמים מהעולם הפיננסי ושוק ההון.
          <br />
          כל מה שצריך לדעת כדי לקבל{" "}
          <span className="font-bold"> החלטות חכמות</span>.
        </p>
        <div className="flex justify-center my-10 gap-10">
          <button className="flex-[0.5] bg-[#022E41] border border-white rounded-md text-white p-5 text-xl hover:bg-white hover:text-[#022E41]">
            בואו נתחיל ללמוד
          </button>
          <button className="flex-[0.5] bg-white text-[#022E41] p-5 border border-[#022E41] rounded-md text-xl hover:bg-[#022E41] hover:text-white hover:border-white">
            המסלולים שלנו
          </button>
        </div>

        <h1 className="text-center text-white text-6xl">
          [....INSERT GUY NATAN VIDEO HERE]
        </h1>
      </div>
    </section>
  );
}
