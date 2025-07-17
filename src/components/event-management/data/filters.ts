
export const filterableColumns = [
  {
    id: "status",
    title: "Status",
    options: [
      { label: "Scheduled", value: "Scheduled" },
      { label: "Cancelled", value: "Cancelled" },
      { label: "Completed", value: "Completed" },
      { label: "No-Show", value: "No-Show" },
    ],
  },
  {
    id: "serviceName",
    title: "Service",
    options: [
      { label: "Legal Advice", value: "Legal Advice" },
      { label: "Financial Planning", value: "Financial Planning" },
      { label: "Technical Support", value: "Technical Support" },
      { label: "Career Counseling", value: "Career Counseling" },
    ],
  },
  {
    id: "meetingType",
    title: "Meeting Type",
    options: [
      { label: "Initial Assessment", value: "Initial Assessment" },
      { label: "Follow-up", value: "Follow-up" },
      { label: "Review", value: "Review" },
    ],
  },
];

export const searchableColumns = [
  {
    id: "clientName",
    title: "Client",
  },
  {
    id: "id",
    title: "Event ID",
  },
];
