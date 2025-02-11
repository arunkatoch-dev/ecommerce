const inputErrorStyles =
  "py-2 border border-red-600 px-2 outline-red-600 rounded-lg w-full";
const inputStyles =
  "py-2 border px-2 rounded-lg cursor-pointer outline-purple-900 w-full";
const errorStyles = "text-sm text-red-600 inline-block w-full text-center";
const Field = ({
  register,
  label,
  toRegister,
  defaultValue,
  errors,
  placeholder,
}) => {
  return (
    <div className="flex flex-col gap-2">
      <div className="flex gap-4 items-center">
        <label className="font-bold">{label}:</label>
        <input
          {...register(toRegister)}
          type="text"
          name={toRegister}
          placeholder={placeholder}
          defaultValue={defaultValue}
          className={
            toRegister === "email"
              ? "cursor-not-allowed outline-none w-full py-2 px-2 rounded-lg"
              : errors[toRegister]
              ? inputErrorStyles
              : inputStyles
          }
        />
      </div>
      {errors[toRegister] && (
        <span className={errorStyles}>{errors[toRegister].message}</span>
      )}
    </div>
  );
};

export default Field;
