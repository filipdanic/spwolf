const timeout = (ms) =>
  new Promise(resolve => setTimeout(resolve, ms));

export const getUserGroup = async ({ role }) => {
  await timeout(2000);
  switch(role) {
    case 0:
      return [
        { value: 0, label: 'Visitor' },
        { value: 1, label: 'Staff' },
      ];
    case 1:
      return [
        { value: 2, label: 'Camera Monitor' },
        { value: 3, label: 'Full System Monitor' },
      ];
    case 2:
      return [
        { value: 4, label: 'Monitoring Manager' },
        { value: 5, label: 'Full System Admin' },
      ];
    default:
      return [];
  }

};

export const generatePIN = async () => {
  await timeout(2250);
  return Math.floor(Math.random() * 100000);
};
