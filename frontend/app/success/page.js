"use client";

export default function SuccessPage() {
  return (
    <div className="h-screen flex justify-center items-center bg-green-100">
      <div className="text-center">
        <h1 className="text-3xl font-bold text-green-700 mb-4">
          Login Successful!
        </h1>
        <p className="text-lg text-gray-700">
          Welcome To Hive
        </p>
      </div>
    </div>
  );
}
