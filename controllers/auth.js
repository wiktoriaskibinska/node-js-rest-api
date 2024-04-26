const User = require("../models/userSchema");
//fukcja sprawdająca token import
const auth = async (req, res, next) => {
  /**przyjmuje w req token ktory jest sprawdzany a nastepnie po sprawdzenie
   * sprawie ze req.user to dane uzytkownika z tokena
   * jeslo się nie powiedzie to nalezu zwrocic res unathorized user
   */
};
