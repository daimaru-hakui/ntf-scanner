"use client";
import React, { useState } from "react";

export const Nfc = () => {
  const [message, setMessage] = useState("");
  const [erroMessage, setErrorMessage] = useState("");

  const onReading = ({ message, serialNumber }: any) => {
    console.log(serialNumber);
    for (const record of message.records) {
      switch (record.recordType) {
        case "text":
          const textDecoder = new TextDecoder(record.encoding);
          console.log("Message", textDecoder.decode(record.data));
          setMessage("読み取り成功");
          break;
        case "url":
          break;
        default:
      }
    }
  };
  const getNfc = async () => {
    // NFC APIが利用可能かチェックする
    if ("NDEFReader" in window) {
        setErrorMessage("NFC APIはサポート!");
      try {
        // @ts-ignore
        const reader = new NDEFReader();
        await reader.scan();
        console.log("Scan started successfully.");
        reader.onreadingerror = () => {
          console.log("Cannot read data from the NFC tag. Try another one?");
          setErrorMessage("失敗")
        };

        reader.onreading = (event) => {
          console.log("NDEF message read.");
          setMessage("NDEF message read.")
          onReading(event); //Find function below
        };
      } catch (error) {}
    } else {
      console.log("NFC APIはサポートされていません。");
      setErrorMessage("NFC APIはサポートされていません。");
    }
  };

  return (
    <div className="flex flex-col justify-center">
      <button
        className="bg-blue-500 py-2 px-4 text-white rounded-md"
        onClick={getNfc}
      >
        SCAN
      </button>
      <div>{message}</div>
      <div className="mt-6">{erroMessage}</div>
    </div>
  );
};
