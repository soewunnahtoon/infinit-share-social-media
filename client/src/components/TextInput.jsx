import { forwardRef } from "react";

const TextInput = forwardRef(
  (
    {
      label,
      labelStyles,
      type,
      name,
      placeholder,
      inputStyles,
      register,
      error,
    },
    ref
  ) => {
    return (
      <div className="w-full flex flex-col">
        {/* Input Lable */}
        {label && (
          <label
            htmlFor={name}
            className={`text-ascent-2 text-sm mb-2 ${labelStyles}`}
          >
            {label}
          </label>
        )}

        {/* Text Input */}
        <input
          type={type || "text"}
          name={name}
          id={name}
          placeholder={placeholder}
          ref={ref}
          className={`bg-secondary rounded border border-[#66666690] outline-none text-sm text-ascent-1 px-4 py-2 placeholder:text-[#666] ${inputStyles}`}
          {...register}
          aria-invalid={error ? "true" : "false"}
        />

        {/* Error Input Message */}
        {error && (
          <span className="text-xs text-[#f64949fe] mt-0.5 ps-4">{error}</span>
        )}
      </div>
    );
  }
);

export default TextInput;
