import React, { useState, useRef } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { useNavigate } from "react-router-dom"
import { collection, addDoc, serverTimestamp } from "firebase/firestore"
import { db } from "@/firebase"
import { useLoading } from "@/context/LoadingContext"
import { 
  User, 
  Users, 
  MapPin, 
  CreditCard, 
  FileText, 
  Upload, 
  Check, 
  ChevronRight, 
  ChevronLeft,
  AlertCircle,
  FileCheck
} from "lucide-react"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

const STEPS = [
  { id: "basic", title: "Basic Info", icon: FileText },
  { id: "personal", title: "Personal", icon: User },
  { id: "contact", title: "Contact", icon: MapPin },
  { id: "financial", title: "Financial", icon: CreditCard },
  { id: "nok", title: "Next of Kin", icon: Users },
  { id: "documents", title: "Documents", icon: Upload },
]

export default function CandidateForm() {
  const navigate = useNavigate()
  const { startLoading, stopLoading } = useLoading()
  const [currentStep, setCurrentStep] = useState(0)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isSuccess, setIsSuccess] = useState(false)
  const [error, setError] = useState("")

  const [formData, setFormData] = useState<any>({
    narration: "",
    tenor: "",
    nin: "",
    bvn: "",
    title: "",
    surname: "",
    firstName: "",
    middleName: "",
    gender: "",
    maritalStatus: "",
    dateOfBirth: "",
    countryOfBirth: "",
    nationality: "Nigerian",
    stateOfOrigin: "",
    lgaOfOrigin: "",
    motherMaidenName: "",
    residentialAddress: "",
    nearestBusStop: "",
    cityTown: "",
    stateOfResidence: "",
    occupation: "",
    phone: "",
    email: "",
    amountNeeded: "",
    accountNumber: "",
    bank: "",
    nokTitle: "",
    nokSurname: "",
    nokFirstName: "",
    nokMiddleName: "",
    nokDateOfBirth: "",
    nokRelationship: "",
    nokGender: "",
    nokPhone: "",
    nokEmail: "",
    nokResidentialAddress: "",
    nokNearestBusStop: "",
    nokCityTown: "",
    nokState: "",
    nokLga: "",
  })

  const [files, setFiles] = useState<any>({
    validId: null,
    utilityBill: null,
    passportPhoto: null,
    signature: null,
  })

  const [uploading, setUploading] = useState<any>({
    validId: false,
    utilityBill: false,
    passportPhoto: false,
    signature: false,
  })

  const [fileUrls, setFileUrls] = useState<any>({
    validId: "",
    utilityBill: "",
    passportPhoto: "",
    signature: "",
  })

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData((prev: any) => ({ ...prev, [name]: value }))
  }

  const handleSelectChange = (name: string, value: string) => {
    setFormData((prev: any) => ({ ...prev, [name]: value }))
  }

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>, field: string) => {
    const file = e.target.files?.[0]
    if (!file) return

    setFiles((prev: any) => ({ ...prev, [field]: file }))
    setUploading((prev: any) => ({ ...prev, [field]: true }))

    // Simulate upload logic
    try {
      await new Promise(resolve => setTimeout(resolve, 1500))
      // In a real app, you'd upload to Firebase Storage here
      const mockUrl = `https://firebasestorage.googleapis.com/v0/b/mock/o/${field}_${Date.now()}.jpg?alt=media`
      setFileUrls((prev: any) => ({ ...prev, [field]: mockUrl }))
    } catch (err) {
      console.error("Upload failed", err)
    } finally {
      setUploading((prev: any) => ({ ...prev, [field]: false }))
    }
  }

  const validateStep = () => {
    setError("")
    const requiredFields: any = {
      0: ["nin", "bvn"],
      1: ["surname", "firstName"],
      2: ["phone", "email"],
      3: ["amountNeeded"],
      4: ["nokSurname", "nokFirstName", "nokPhone"],
      5: ["validId", "utilityBill", "passportPhoto", "signature"]
    }

    const currentRequired = requiredFields[currentStep] || []
    
    if (currentStep === 5) {
      // Check file URLs for the last step
      const missingFiles = currentRequired.filter((field: string) => !fileUrls[field])
      if (missingFiles.length > 0) {
        setError("Please upload all required documents before completing.")
        return false
      }
      return true
    }

    const missingFields = currentRequired.filter((field: string) => !formData[field])
    
    if (missingFields.length > 0) {
      setError("Please fill in all required fields marked with *")
      return false
    }

    // Additional validation for specific fields
    if (currentStep === 0) {
      if (formData.nin.length !== 11 || isNaN(Number(formData.nin))) {
        setError("NIN must be exactly 11 digits")
        return false
      }
      if (formData.bvn.length !== 11 || isNaN(Number(formData.bvn))) {
        setError("BVN must be exactly 11 digits")
        return false
      }
    }

    return true
  }

  const nextStep = () => {
    if (validateStep()) {
      if (currentStep < STEPS.length - 1) {
        setCurrentStep(currentStep + 1)
        window.scrollTo(0, 0)
      }
    }
  }

  const prevStep = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1)
      window.scrollTo(0, 0)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!validateStep()) return

    setIsSubmitting(true)
    startLoading()
    setError("")
    
    try {
      const submissionData = {
        ...formData,
        amountNeeded: parseFloat(formData.amountNeeded),
        validIdUrl: fileUrls.validId,
        utilityBillUrl: fileUrls.utilityBill,
        passportPhotoUrl: fileUrls.passportPhoto,
        signatureUrl: fileUrls.signature,
        status: "pending",
        createdAt: serverTimestamp()
      }

      await addDoc(collection(db, "applications"), submissionData)
      setIsSuccess(true)
    } catch (err: any) {
      console.error("Error submitting application:", err)
      setError("Failed to submit application. Please ensure all required fields are filled correctly.")
    } finally {
      setIsSubmitting(false)
      stopLoading()
    }
  }

  if (isSuccess) {
    return (
      <div className="container max-w-2xl py-20 mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="text-center space-y-6"
        >
          <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-green-100 text-green-600 mb-4">
            <Check className="w-10 h-10" />
          </div>
          <h2 className="text-4xl font-bold tracking-tight">Application Received!</h2>
          <p className="text-muted-foreground text-lg max-w-md mx-auto">
            Thank you for choosing Tife Trust Global. Your application is being processed and our team will contact you within 24-48 hours.
          </p>
          <div className="pt-8">
            <Button onClick={() => navigate("/")} size="lg" className="rounded-full px-8">
              Return to Home
            </Button>
          </div>
        </motion.div>
      </div>
    )
  }

  return (
    <div className="container max-w-4xl py-12 mx-auto px-4">
      <div className="mb-12">
        <div className="flex justify-between items-center mb-8 relative">
          <div className="absolute left-0 top-1/2 -translate-y-1/2 w-full h-0.5 bg-muted z-0" />
          <div 
            className="absolute left-0 top-1/2 -translate-y-1/2 h-0.5 bg-primary z-0 transition-all duration-500" 
            style={{ width: `${(currentStep / (STEPS.length - 1)) * 100}%` }}
          />
          {STEPS.map((step, i) => (
            <div key={step.id} className="relative z-10 flex flex-col items-center">
              <div 
                className={`w-10 h-10 rounded-full flex items-center justify-center border-2 transition-all duration-300 ${
                  i <= currentStep ? "bg-primary border-primary text-primary-foreground" : "bg-background border-muted text-muted-foreground"
                }`}
              >
                {i < currentStep ? <Check className="h-5 w-5" /> : <step.icon className="h-5 w-5" />}
              </div>
              <span className={`text-[10px] uppercase tracking-wider font-bold mt-2 hidden md:block ${
                i <= currentStep ? "text-primary" : "text-muted-foreground"
              }`}>
                {step.title}
              </span>
            </div>
          ))}
        </div>
      </div>

      <motion.div
        key={currentStep}
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        exit={{ opacity: 0, x: -20 }}
        transition={{ duration: 0.3 }}
      >
        <Card className="shadow-xl border-primary/5">
          <CardHeader className="bg-primary/5 border-b">
            <div className="flex justify-between items-center">
              <div>
                <CardTitle className="text-2xl text-primary">{STEPS[currentStep].title}</CardTitle>
                <CardDescription>Step {currentStep + 1} of {STEPS.length}</CardDescription>
              </div>
              <div className="text-right hidden sm:block">
                <p className="text-xs font-bold text-primary uppercase tracking-widest">Application Form</p>
                <p className="text-xs text-muted-foreground">Tife Trust Global</p>
              </div>
            </div>
          </CardHeader>
          <CardContent className="pt-8">
            {error && (
              <div className="mb-6 p-4 bg-destructive/10 text-destructive rounded-xl flex items-center gap-3 border border-destructive/20">
                <AlertCircle className="h-5 w-5 shrink-0" />
                <p className="text-sm font-medium">{error}</p>
              </div>
            )}

            <form className="space-y-8">
              {/* Step 1: Basic Info */}
              {currentStep === 0 && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="narration">Narration</Label>
                    <Input id="narration" name="narration" value={formData.narration} onChange={handleInputChange} placeholder="Reason for application" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="tenor">Tenor</Label>
                    <Input id="tenor" name="tenor" value={formData.tenor} onChange={handleInputChange} placeholder="e.g. 6 months" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="nin">NIN (National Identity Number) *</Label>
                    <Input id="nin" name="nin" value={formData.nin} onChange={handleInputChange} required placeholder="11-digit number" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="bvn">BVN (Bank Verification Number) *</Label>
                    <Input id="bvn" name="bvn" value={formData.bvn} onChange={handleInputChange} required placeholder="11-digit number" />
                  </div>
                </div>
              )}

              {/* Step 2: Personal Details */}
              {currentStep === 1 && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="title">Title</Label>
                    <Select onValueChange={(v) => handleSelectChange("title", v)} defaultValue={formData.title}>
                      <SelectTrigger><SelectValue placeholder="Select title" /></SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Mr">Mr</SelectItem>
                        <SelectItem value="Mrs">Mrs</SelectItem>
                        <SelectItem value="Ms">Ms</SelectItem>
                        <SelectItem value="Dr">Dr</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="surname">Surname *</Label>
                    <Input id="surname" name="surname" value={formData.surname} onChange={handleInputChange} required />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="firstName">First Name *</Label>
                    <Input id="firstName" name="firstName" value={formData.firstName} onChange={handleInputChange} required />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="middleName">Middle Name</Label>
                    <Input id="middleName" name="middleName" value={formData.middleName} onChange={handleInputChange} />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="gender">Gender</Label>
                    <Select onValueChange={(v) => handleSelectChange("gender", v)} defaultValue={formData.gender}>
                      <SelectTrigger><SelectValue placeholder="Select gender" /></SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Male">Male</SelectItem>
                        <SelectItem value="Female">Female</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="maritalStatus">Marital Status</Label>
                    <Select onValueChange={(v) => handleSelectChange("maritalStatus", v)} defaultValue={formData.maritalStatus}>
                      <SelectTrigger><SelectValue placeholder="Select status" /></SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Single">Single</SelectItem>
                        <SelectItem value="Married">Married</SelectItem>
                        <SelectItem value="Divorced">Divorced</SelectItem>
                        <SelectItem value="Widowed">Widowed</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="dateOfBirth">Date of Birth</Label>
                    <Input id="dateOfBirth" name="dateOfBirth" type="date" value={formData.dateOfBirth} onChange={handleInputChange} />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="countryOfBirth">Country of Birth</Label>
                    <Input id="countryOfBirth" name="countryOfBirth" value={formData.countryOfBirth} onChange={handleInputChange} />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="nationality">Nationality</Label>
                    <Input id="nationality" name="nationality" value={formData.nationality} onChange={handleInputChange} />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="stateOfOrigin">State of Origin</Label>
                    <Input id="stateOfOrigin" name="stateOfOrigin" value={formData.stateOfOrigin} onChange={handleInputChange} />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="lgaOfOrigin">LGA of Origin</Label>
                    <Input id="lgaOfOrigin" name="lgaOfOrigin" value={formData.lgaOfOrigin} onChange={handleInputChange} />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="motherMaidenName">Mother’s Maiden Name</Label>
                    <Input id="motherMaidenName" name="motherMaidenName" value={formData.motherMaidenName} onChange={handleInputChange} />
                  </div>
                </div>
              )}

              {/* Step 3: Contact & Address */}
              {currentStep === 2 && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="md:col-span-2 space-y-2">
                    <Label htmlFor="residentialAddress">Residential Address</Label>
                    <Input id="residentialAddress" name="residentialAddress" value={formData.residentialAddress} onChange={handleInputChange} />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="nearestBusStop">Nearest Bus Stop</Label>
                    <Input id="nearestBusStop" name="nearestBusStop" value={formData.nearestBusStop} onChange={handleInputChange} />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="cityTown">City/Town</Label>
                    <Input id="cityTown" name="cityTown" value={formData.cityTown} onChange={handleInputChange} />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="stateOfResidence">State of Residence</Label>
                    <Input id="stateOfResidence" name="stateOfResidence" value={formData.stateOfResidence} onChange={handleInputChange} />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="phone">Phone Number *</Label>
                    <Input id="phone" name="phone" type="tel" value={formData.phone} onChange={handleInputChange} required />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="email">Email *</Label>
                    <Input id="email" name="email" type="email" value={formData.email} onChange={handleInputChange} required />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="occupation">Occupation</Label>
                    <Input id="occupation" name="occupation" value={formData.occupation} onChange={handleInputChange} />
                  </div>
                </div>
              )}

              {/* Step 4: Financial Details */}
              {currentStep === 3 && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="amountNeeded">Amount Needed (₦) *</Label>
                    <Input id="amountNeeded" name="amountNeeded" type="number" value={formData.amountNeeded} onChange={handleInputChange} required />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="accountNumber">Account Number</Label>
                    <Input id="accountNumber" name="accountNumber" value={formData.accountNumber} onChange={handleInputChange} />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="bank">Bank</Label>
                    <Input id="bank" name="bank" value={formData.bank} onChange={handleInputChange} />
                  </div>
                </div>
              )}

              {/* Step 5: Next of Kin */}
              {currentStep === 4 && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="nokTitle">Title</Label>
                    <Input id="nokTitle" name="nokTitle" value={formData.nokTitle} onChange={handleInputChange} />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="nokSurname">Surname *</Label>
                    <Input id="nokSurname" name="nokSurname" value={formData.nokSurname} onChange={handleInputChange} required />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="nokFirstName">First Name *</Label>
                    <Input id="nokFirstName" name="nokFirstName" value={formData.nokFirstName} onChange={handleInputChange} required />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="nokMiddleName">Middle Name</Label>
                    <Input id="nokMiddleName" name="nokMiddleName" value={formData.nokMiddleName} onChange={handleInputChange} />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="nokDateOfBirth">Date of Birth</Label>
                    <Input id="nokDateOfBirth" name="nokDateOfBirth" type="date" value={formData.nokDateOfBirth} onChange={handleInputChange} />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="nokRelationship">Relationship</Label>
                    <Input id="nokRelationship" name="nokRelationship" value={formData.nokRelationship} onChange={handleInputChange} />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="nokGender">Gender</Label>
                    <Select onValueChange={(v) => handleSelectChange("nokGender", v)} defaultValue={formData.nokGender}>
                      <SelectTrigger><SelectValue placeholder="Select gender" /></SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Male">Male</SelectItem>
                        <SelectItem value="Female">Female</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="nokPhone">Phone Number *</Label>
                    <Input id="nokPhone" name="nokPhone" type="tel" value={formData.nokPhone} onChange={handleInputChange} required />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="nokEmail">Email</Label>
                    <Input id="nokEmail" name="nokEmail" type="email" value={formData.nokEmail} onChange={handleInputChange} />
                  </div>
                  <div className="md:col-span-2 space-y-2">
                    <Label htmlFor="nokResidentialAddress">Residential Address</Label>
                    <Input id="nokResidentialAddress" name="nokResidentialAddress" value={formData.nokResidentialAddress} onChange={handleInputChange} />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="nokNearestBusStop">Nearest Bus Stop</Label>
                    <Input id="nokNearestBusStop" name="nokNearestBusStop" value={formData.nokNearestBusStop} onChange={handleInputChange} />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="nokCityTown">City/Town</Label>
                    <Input id="nokCityTown" name="nokCityTown" value={formData.nokCityTown} onChange={handleInputChange} />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="nokState">State</Label>
                    <Input id="nokState" name="nokState" value={formData.nokState} onChange={handleInputChange} />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="nokLga">LGA</Label>
                    <Input id="nokLga" name="nokLga" value={formData.nokLga} onChange={handleInputChange} />
                  </div>
                </div>
              )}

              {/* Step 6: Documents */}
              {currentStep === 5 && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  {[
                    { id: "validId", label: "Valid ID (With names as on BVN)", desc: "National ID, Passport, or Driver's License" },
                    { id: "utilityBill", label: "Utility Bill (Current)", desc: "Electricity, Water, or Waste bill" },
                    { id: "passportPhoto", label: "Passport Photo", desc: "Clear, recent passport-sized photograph" },
                    { id: "signature", label: "Signature", desc: "Signed on plain white paper" },
                  ].map((doc) => (
                    <div key={doc.id} className="space-y-4 p-6 rounded-2xl border-2 border-dashed border-muted hover:border-primary/50 transition-colors bg-muted/5">
                      <div className="flex justify-between items-start">
                        <div className="space-y-1">
                          <Label className="text-base font-bold">{doc.label}</Label>
                          <p className="text-xs text-muted-foreground">{doc.desc}</p>
                        </div>
                        {fileUrls[doc.id] && <FileCheck className="h-6 w-6 text-green-500" />}
                      </div>
                      
                      <div className="relative">
                        <input 
                          type="file" 
                          id={doc.id} 
                          className="hidden" 
                          onChange={(e) => handleFileChange(e, doc.id)}
                          accept="image/*,.pdf"
                        />
                        <Button 
                          type="button" 
                          variant="outline" 
                          className="w-full h-12 rounded-xl gap-2 relative overflow-hidden"
                          onClick={() => document.getElementById(doc.id)?.click()}
                          disabled={uploading[doc.id]}
                        >
                          {uploading[doc.id] ? (
                            <motion.div 
                              className="absolute inset-0 bg-primary/10"
                              initial={{ width: 0 }}
                              animate={{ width: "100%" }}
                              transition={{ duration: 1.5 }}
                            />
                          ) : null}
                          <Upload className="h-4 w-4" />
                          {uploading[doc.id] ? "Uploading..." : fileUrls[doc.id] ? "Change File" : "Upload File"}
                        </Button>
                      </div>
                      {fileUrls[doc.id] && (
                        <p className="text-[10px] text-green-600 font-medium flex items-center gap-1">
                          <Check className="h-3 w-3" /> File uploaded successfully
                        </p>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </form>
          </CardContent>
          <CardFooter className="flex justify-between border-t bg-muted/5 p-6">
            <Button 
              variant="ghost" 
              onClick={prevStep} 
              disabled={currentStep === 0 || isSubmitting}
              className="gap-2"
            >
              <ChevronLeft className="h-4 w-4" /> Previous
            </Button>
            
            {currentStep === STEPS.length - 1 ? (
              <Button 
                onClick={handleSubmit} 
                disabled={isSubmitting}
                className="gap-2 px-8 rounded-full"
              >
                {isSubmitting ? "Submitting..." : "Complete Application"}
                {!isSubmitting && <Check className="h-4 w-4" />}
              </Button>
            ) : (
              <Button 
                onClick={nextStep} 
                className="gap-2 px-8 rounded-full"
              >
                Next Step <ChevronRight className="h-4 w-4" />
              </Button>
            )}
          </CardFooter>
        </Card>
      </motion.div>
    </div>
  )
}
