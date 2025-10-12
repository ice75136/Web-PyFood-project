import jwt from 'jsonwebtoken'

const authUser = async (req, res, next) => {

     const token = req.header('Authorization')?.replace('Bearer ', '');

    if (!token) {
        return res.status(401).json({ message: 'No token, authorization denied' });
    }

    try {
         const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = decoded; // แปะข้อมูล user (เช่น id) เข้าไปใน request
        next();

    } catch (error) {
        res.status(401).json({ message: 'Token is not valid' });
    }

}

export default authUser