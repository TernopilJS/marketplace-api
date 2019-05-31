export const requiredAuth = async (req) => req.jwtVerify();

export const optionalAuth = async (req) => {
  try {
    await req.jwtVerify();
  } catch (error) {
    // do nothing
  }
};
