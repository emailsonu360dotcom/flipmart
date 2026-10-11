/* ------------------------------------------------------------------
   UPI receiver settings (used for the UPI QR code and UPI app buttons)
   ------------------------------------------------------------------
   Change `vpa` to the UPI ID that should RECEIVE the payment, e.g.
   "yourname@okhdfcbank" or "9876543210@ybl", and `name` to the name
   shown to the payer in their UPI app.

   NOTE: this is a front-end demo with no payment gateway, so the site
   cannot automatically detect that money arrived. Use a test UPI ID
   (or your own) while demonstrating; real payments will go to it.
------------------------------------------------------------------ */
window.UPI_CONFIG = {
  vpa:  "sonu.409@superyes",
  name: "Flipkart Demo Store"
};
