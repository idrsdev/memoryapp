export const userWithNoPassword = (user) => {
  const { _doc: userDocument } = user;
  const { password: pwd, ...userWithoutPassword } = userDocument;
  return userWithoutPassword;
};
