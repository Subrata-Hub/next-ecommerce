// "use client";
// import React, { useState } from "react";
// import Logo from "@/public/assets/images/logo-black.png";
// import { Card, CardContent } from "@/components/ui/card";
// import Image from "next/image";

// import { zodResolver } from "@hookform/resolvers/zod";
// import { useForm } from "react-hook-form";
// import { credentialsSchema } from "@/lib/zodSchema";

// import { Button } from "@/components/ui/button";
// import {
//   Form,
//   FormControl,
//   FormDescription,
//   FormField,
//   FormItem,
//   FormLabel,
//   FormMessage,
// } from "@/components/ui/form";
// import { Input } from "@/components/ui/input";
// import ButtonLoading from "@/components/application/ButtonLoading";
// import z from "zod";
// import { FaRegEyeSlash } from "react-icons/fa";
// import { FaRegEye } from "react-icons/fa6";
// import Link from "next/link";
// import { WEBSITE_LOGIN, WEBSITE_REGISTER } from "@/routes/WebsiteRoutes";
// import axios from "axios";
// import { showToast } from "@/lib/showToast";
// import { DialogContent, DialogTitle } from "@/components/ui/dialog";

// const Register = () => {
//   const [loading, setLoading] = useState(false);
//   const [isTypePassword, setIsTypePassword] = useState(true);
//   const formSchema = credentialsSchema
//     .pick({
//       name: true,
//       email: true,
//       password: true,
//     })
//     .extend({
//       confirmPassword: z.string(),
//     })
//     .refine((data) => data.password === data.confirmPassword, {
//       message: "password and confirm password must be same",
//       path: ["confirmPassword"],
//     });

//   // 1. Define your form.
//   const form = useForm({
//     resolver: zodResolver(formSchema),
//     defaultValues: {
//       name: "",
//       email: "",
//       password: "",
//       confirmPassword: "",
//     },
//   });

//   const handleRegisterSubmit = async (values) => {
//     try {
//       setLoading(true);
//       const { data: registerResponse } = await axios.post(
//         "/api/auth/register",
//         values
//       );
//       if (!registerResponse.success) {
//         throw new Error(registerResponse.message);
//       }

//       form.reset();
//       showToast("success", registerResponse.message);
//     } catch (error) {
//       showToast("error", error.message);
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <Card className="w-[400px]">
//       <CardContent>
//         <div className="flex justify-center">
//           <Image src={Logo} alt="logo" className="max-w-[150px]" priority />
//         </div>
//         <div className="text-center">
//           <h1 className="text-2xl font-semibold">Create Account</h1>
//           <p>Create a account by filling out the from bellow</p>
//         </div>
//         <div className="mt-5">
//           <Form {...form}>
//             <form onSubmit={form.handleSubmit(handleRegisterSubmit)}>
//               <div className="mb-5">
//                 <FormField
//                   control={form.control}
//                   name="name"
//                   render={({ field }) => (
//                     <FormItem>
//                       <FormLabel>Full Nane</FormLabel>
//                       <FormControl>
//                         <Input type="text" placeholder="Jhon Doe" {...field} />
//                       </FormControl>

//                       <FormMessage />
//                     </FormItem>
//                   )}
//                 />
//               </div>
//               <div className="mb-5">
//                 <FormField
//                   control={form.control}
//                   name="email"
//                   render={({ field }) => (
//                     <FormItem>
//                       <FormLabel>Email</FormLabel>
//                       <FormControl>
//                         <Input
//                           type="email"
//                           placeholder="example@gmail.com"
//                           {...field}
//                         />
//                       </FormControl>

//                       <FormMessage />
//                     </FormItem>
//                   )}
//                 />
//               </div>
//               <div className="mb-5">
//                 <FormField
//                   control={form.control}
//                   name="password"
//                   render={({ field }) => (
//                     <FormItem className="relative">
//                       <FormLabel>Password</FormLabel>
//                       <FormControl>
//                         <Input
//                           //   type={isTypePassword ? "password" : "text"}
//                           type="password"
//                           placeholder="************"
//                           {...field}
//                         />
//                       </FormControl>

//                       <FormMessage />
//                     </FormItem>
//                   )}
//                 />
//               </div>
//               <div className="mb-5">
//                 <FormField
//                   control={form.control}
//                   name="confirmPassword"
//                   render={({ field }) => (
//                     <FormItem className="relative">
//                       <FormLabel>Confirm Password</FormLabel>
//                       <FormControl>
//                         <Input
//                           type={isTypePassword ? "password" : "text"}
//                           placeholder="**********"
//                           {...field}
//                         />
//                       </FormControl>
//                       <button
//                         type="button"
//                         className="absolute top-1/2 right-2 cursor-pointer"
//                         onClick={() => setIsTypePassword(!isTypePassword)}
//                       >
//                         {isTypePassword ? <FaRegEyeSlash /> : <FaRegEye />}
//                       </button>

//                       <FormMessage />
//                     </FormItem>
//                   )}
//                 />
//               </div>
//               <div>
//                 <ButtonLoading
//                   type="submit"
//                   text="Create Account"
//                   className="w-full cursor-pointer"
//                   loading={loading}
//                 />
//               </div>
//               <div className="text-center">
//                 <div className="flex justify-center items-center gap-1">
//                   <p>Already have account</p>
//                   <Link href={WEBSITE_LOGIN} className="text-primary underline">
//                     Login
//                   </Link>
//                 </div>
//                 {/* <div className="mt-3">
//                   <Link href="" className="text-primary underline">
//                     Forget password
//                   </Link>
//                 </div> */}
//               </div>
//             </form>
//           </Form>
//         </div>
//       </CardContent>

//     </Card>
//   );
// };

// export default Register;
