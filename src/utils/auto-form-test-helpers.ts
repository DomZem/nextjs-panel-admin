import { screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import dayjs from "dayjs";

export const enterAutoFormDate = async ({
  label,
  day,
  hour,
  minute,
}: {
  label: string;
  day: number;
  hour: number;
  minute: number;
}) => {
  // Open the DateTimePicker
  const triggerBtn = screen.getByRole("button", { name: label });
  await userEvent.click(triggerBtn);

  // Select a day
  const dayBtn = screen.getByRole("gridcell", {
    name: day.toString(),
  });
  await userEvent.click(dayBtn);

  // Select an hour
  const hourBtn = screen.getByTestId(`calendar-hour-${hour}`);
  await userEvent.click(hourBtn);

  // Select a minute
  const minuteBtn = screen.getByTestId(`calendar-minute-${minute}`);
  await userEvent.click(minuteBtn);

  return triggerBtn;
};

export const selectAutoFormOption = async ({
  placeholder,
  optionName,
}: {
  placeholder: string;
  optionName: string;
}) => {
  const selectBtn = screen.getByRole("combobox", { name: placeholder });
  await userEvent.click(selectBtn);

  const selectOption = screen.getByRole("option", { name: optionName });
  await userEvent.click(selectOption);
};

export const getFormattedCurrentMonth = () => dayjs().format("MMM");

export const getCurrentMonthNumber = () => dayjs().format("MM");
