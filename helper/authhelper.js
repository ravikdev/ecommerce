import bcrypt from bcrypt; 
export const hashPassword = async(password) =>{
try{
    const salt =10;
    const hashedPassword = bcrypt.hash(password,salt);
}
catch(error){
console.log(error);
}
};

export const comparePassword = async(password,hashPassword)=>{
    return bcrypt.compare(password,hashedPassword);
};
