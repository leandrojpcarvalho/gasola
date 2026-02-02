import Swal, { type SweetAlertIcon } from "sweetalert2";

const statusMap: Record<number, SweetAlertIcon> = {
  404: "error",
  200: "success",
  201: "success",
  400: "warning",
} as const;

export type StatusCodes = keyof typeof statusMap;

export function alert(status: StatusCodes, title: string, text: string) {
  Swal.fire({
    icon: statusMap[status],
    title,
    text,
  });
}
