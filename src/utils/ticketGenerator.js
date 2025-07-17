module.exports = function generateTicket() {
  return 'TX-' + Math.random().toString(36).substring(2, 8).toUpperCase();
};

