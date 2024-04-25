const errorHandle = (error, _req, res, next) => {
  console.log({ error });
  return res.status(400).send(error.message);
};
export default errorHandle;
