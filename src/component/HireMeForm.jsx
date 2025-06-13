import React, { useState, useMemo } from "react";
import { motion } from "framer-motion";
import { Input, Button, Card, CardContent, Progress } from "./ui";
import { FaUser, FaPhone, FaEnvelope, FaBuilding, FaBriefcase, FaMoneyBillWave, FaFileAlt } from 'react-icons/fa';

export default function HireMeForm() {
  const [formData, setFormData] = useState({
    hrName: "",
    phone: "",
    email: "",
    organization: "",
    role: "",
    salary: "",
    description: "",
  });
  const [isLoading, setIsLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [showValidation, setShowValidation] = useState(false);
  const [error, setError] = useState(null);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const validate = useMemo(
    () => ({
      hrName: formData.hrName.trim().length >= 3,
      phone: /^\d{10}$/.test(formData.phone),
      email: /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email),
      organization: formData.organization.trim().length >= 2,
      role: formData.role.trim().length > 0,
      description: formData.description.trim().length > 0,
    }),
    [formData]
  );

  const isFormValid = Object.values(validate).every(Boolean);
  const completion =
    (Object.values(validate).filter(Boolean).length /
      Object.keys(validate).length) *
    100;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setShowValidation(true);
    if (isFormValid) {
      setIsLoading(true);
      setError(null);
      try {
        const response = await fetch(`${import.meta.env.VITE_BASE_URL}/api/application`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(formData),
        });
        
        if (!response.ok) {
          throw new Error('Failed to submit application');
        }
        
        setSubmitted(true);
      } catch (err) {
        setError(err.message);
      } finally {
        setIsLoading(false);
      }
    }
  };

  const fields = [
    { label: "Name of HR", name: "hrName", icon: FaUser },
    { label: "Phone Number", name: "phone", icon: FaPhone },
    { label: "Email", name: "email", icon: FaEnvelope },
    { label: "Organization Name", name: "organization", icon: FaBuilding },
    { label: "Role (Hiring for)", name: "role", icon: FaBriefcase },
    { label: "Expected Salary (optional)", name: "salary", icon: FaMoneyBillWave, optional: true },
    { label: "Job Description", name: "description", icon: FaFileAlt },
  ];
  

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-500 to-purple-600 p-2 sm:p-4 md:p-6 relative overflow-hidden">
      <div className="absolute inset-0 bg-white/10 backdrop-blur-3xl"></div>
      <Card className="w-[95%] sm:w-[90%] md:w-[85%] lg:w-[70%] xl:w-[60%] max-w-lg p-3 sm:p-4 md:p-6 relative overflow-hidden rounded-2xl shadow-2xl bg-white/20 backdrop-blur-xl border border-white/30">
        {!submitted && <Progress value={completion} className="mb-4 h-1 bg-white/20 [&>div]:bg-white/40" />}
        {!submitted ? (
          <>
            <h2 className="text-xl sm:text-2xl md:text-xl font-bold text-center mb-3 sm:mb-4 md:mb-6 text-white">
            {import.meta.env.VITE_FORM_HEADER}
            </h2>
            <form onSubmit={handleSubmit} className="space-y-2 sm:space-y-3 md:space-y-4">
              {fields.map((field, i) => (
                <motion.div
                  key={field.name}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.1 }}
                  className="relative"
                >
                  <div className="relative">
                    <field.icon className="absolute left-3 top-1/2 transform -translate-y-1/2 text-black/90 hover:text-black/80 transition-colors duration-200" />
                    <Input
                      type={field.name === "email" ? "email" : "text"}
                      placeholder={field.label}
                      name={field.name}
                      value={formData[field.name]}
                      onChange={handleChange}
                      className={`transition-all focus:ring-0 focus:outline-none rounded-lg pl-10 pr-4 py-2 w-full bg-white/50 blue text-sm sm:text-base
                        ${showValidation && !validate[field.name] && !field.optional
                          ? "border-red-500"
                          : "border-transparent bg-gradient-to-r from-indigo-500/50 to-purple-500/50"
                        }`}
                    />
                  </div>
                  {showValidation && !validate[field.name] && !field.optional && (
                    <p className="text-xs sm:text-sm text-red-500 mt-1 italic">
                      Required Field
                    </p>
                  )}
                </motion.div>
              ))}
              {completion === 100 && (
                <motion.p
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="text-white text-sm text-center font-medium mb-2"
                >
                  ✅ Validation: Passed. Submit to glory!
                </motion.p>
              )}
              <Button
                type="submit"
                disabled={isLoading || submitted}
                className={`w-full mt-3 sm:mt-4 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white font-semibold py-2 px-4 rounded-xl transition-all duration-300 text-sm sm:text-base focus:outline-none focus:ring-0 ${
                  (isLoading || submitted) ? 'opacity-50 cursor-not-allowed' : ''
                }`}
                onClick={handleSubmit}
              >
                <motion.div
                  animate={isLoading ? { scale: [1, 1.1, 1] } : {}}
                  transition={{ duration: 1, repeat: isLoading ? Infinity : 0 }}
                >
                  {isLoading ? 'Submitting...' : submitted ? 'Submitted!' : 'Submit'}
                </motion.div>
              </Button>
              {error && (
                <motion.p
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="text-red-500 text-sm mt-2 text-center"
                >
                  {error}
                </motion.p>
              )}
            </form>
          </>
        ) : (
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            className="text-center py-6 sm:py-8 md:py-12 relative"
          >
            {[...Array(17)].map((_, i) => (
              <motion.div
                key={i}
                initial={{ y: -100, x: Math.random() * 200 - 100, opacity: 0 }}
                animate={{ y: 500, opacity: [0, 1, 1, 0] }}
                transition={{
                  duration: 5,
                  delay: i * 0.2,
                  repeat: Infinity,
                  repeatDelay: 0
                }}
                className="absolute text-2xl"
                style={{ left: `${Math.random() * 100}%` }}
              >
                {['🎉', '✨', '🎊', '👏', '🎯', '💫', '🌟', '🎈', '🎨', '🎭','🎁','🪄','🤗','🤩','🥳','💫','💖'][i]}
              </motion.div>
            ))}
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-white mb-2">Thank You! 🎉</h2>
            <p className="text-white/80 text-sm sm:text-base md:text-lg">
              Your hiring interest has been submitted successfully.
            </p>
          </motion.div>
        )}
      </Card>
    </div>
  );
}
