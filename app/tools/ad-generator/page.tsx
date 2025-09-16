"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"
import {
  Search,
  Bell,
  ChevronDown,
  BarChart3,
  TrendingUp,
  Users,
  Target,
  Settings,
  HeadphonesIcon,
  SearchIcon,
  Wrench,
  ArrowLeft,
  Wand2,
  ImageIcon,
  Sparkles,
  Download,
  RefreshCw,
} from "lucide-react"
import Link from "next/link"

export default function AdGeneratorPage() {

  return (
    <div className="text-white">
      {/* Main Content */}
      <div className="flex-1 flex flex-col">
        {/* Header */}
        <header className="bg-[#201b2d] border-b border-[#2b2b2b] p-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-[#afafaf]" />
                <Input
                  placeholder="Search"
                  className="pl-10 bg-[#2b2b2b] border-[#3f3f3f] text-white placeholder-[#afafaf] w-80"
                />
              </div>
            </div>

            <div className="flex items-center space-x-4">
              <Button variant="ghost" className="text-[#afafaf] hover:text-white">
                Select Business Manager
                <ChevronDown className="ml-2 h-4 w-4" />
              </Button>
              <Button variant="ghost" size="icon" className="text-[#afafaf] hover:text-white">
                <Bell className="h-5 w-5" />
              </Button>
              <div className="w-8 h-8 bg-gradient-to-br from-[#a545b6] to-[#cd4f9d] rounded-full"></div>
            </div>
          </div>
        </header>

        {/* Ad Generator Content */}
        <main className="flex-1 p-6">
          <div className="space-y-6">
            {/* Page Header */}
            <div className="flex items-center space-x-4 mb-8">
              <Link href="/tools">
                <Button variant="ghost" size="icon" className="text-[#afafaf] hover:text-white">
                  <ArrowLeft className="h-5 w-5" />
                </Button>
              </Link>
              <div>
                <h1 className="text-3xl font-bold flex items-center">
                  <Wand2 className="h-8 w-8 mr-3 text-[#a545b6]" />
                  Facebook Ad Generator
                </h1>
                <p className="text-[#afafaf] mt-2">Create perfect product image ads with AI assistance</p>
              </div>
            </div>

            <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">
              {/* Form Section */}
              <div className="space-y-6">
                {/* Product Information */}
                <Card className="bg-[#2b2b2b] border-[#3f3f3f]">
                  <CardHeader>
                    <CardTitle className="text-white flex items-center">
                      <ImageIcon className="h-5 w-5 mr-2" />
                      Product Information
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="product-name" className="text-[#afafaf]">
                        Product Name *
                      </Label>
                      <Input
                        id="product-name"
                        placeholder="e.g., Wireless Bluetooth Headphones"
                        className="bg-[#3f3f3f] border-[#4f4f4f] text-white placeholder-[#afafaf]"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="product-category" className="text-[#afafaf]">
                        Product Category *
                      </Label>
                      <Select>
                        <SelectTrigger className="bg-[#3f3f3f] border-[#4f4f4f] text-white">
                          <SelectValue placeholder="Select category" />
                        </SelectTrigger>
                        <SelectContent className="bg-[#3f3f3f] border-[#4f4f4f]">
                          <SelectItem value="electronics">Electronics</SelectItem>
                          <SelectItem value="fashion">Fashion & Apparel</SelectItem>
                          <SelectItem value="home">Home & Garden</SelectItem>
                          <SelectItem value="beauty">Beauty & Personal Care</SelectItem>
                          <SelectItem value="sports">Sports & Outdoors</SelectItem>
                          <SelectItem value="books">Books & Media</SelectItem>
                          <SelectItem value="food">Food & Beverages</SelectItem>
                          <SelectItem value="other">Other</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="product-description" className="text-[#afafaf]">
                        Product Description *
                      </Label>
                      <Textarea
                        id="product-description"
                        placeholder="Describe your product's key features, benefits, and what makes it special..."
                        className="bg-[#3f3f3f] border-[#4f4f4f] text-white placeholder-[#afafaf] min-h-[100px]"
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="price" className="text-[#afafaf]">
                          Price ($)
                        </Label>
                        <Input
                          id="price"
                          type="number"
                          placeholder="99.99"
                          className="bg-[#3f3f3f] border-[#4f4f4f] text-white placeholder-[#afafaf]"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="discount" className="text-[#afafaf]">
                          Discount (%)
                        </Label>
                        <Input
                          id="discount"
                          type="number"
                          placeholder="20"
                          className="bg-[#3f3f3f] border-[#4f4f4f] text-white placeholder-[#afafaf]"
                        />
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Target Audience */}
                <Card className="bg-[#2b2b2b] border-[#3f3f3f]">
                  <CardHeader>
                    <CardTitle className="text-white flex items-center">
                      <Users className="h-5 w-5 mr-2" />
                      Target Audience
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="age-range" className="text-[#afafaf]">
                          Age Range
                        </Label>
                        <Select>
                          <SelectTrigger className="bg-[#3f3f3f] border-[#4f4f4f] text-white">
                            <SelectValue placeholder="Select age range" />
                          </SelectTrigger>
                          <SelectContent className="bg-[#3f3f3f] border-[#4f4f4f]">
                            <SelectItem value="18-24">18-24</SelectItem>
                            <SelectItem value="25-34">25-34</SelectItem>
                            <SelectItem value="35-44">35-44</SelectItem>
                            <SelectItem value="45-54">45-54</SelectItem>
                            <SelectItem value="55-64">55-64</SelectItem>
                            <SelectItem value="65+">65+</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="gender" className="text-[#afafaf]">
                          Gender
                        </Label>
                        <Select>
                          <SelectTrigger className="bg-[#3f3f3f] border-[#4f4f4f] text-white">
                            <SelectValue placeholder="Select gender" />
                          </SelectTrigger>
                          <SelectContent className="bg-[#3f3f3f] border-[#4f4f4f]">
                            <SelectItem value="all">All</SelectItem>
                            <SelectItem value="male">Male</SelectItem>
                            <SelectItem value="female">Female</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="interests" className="text-[#afafaf]">
                        Interests & Hobbies
                      </Label>
                      <Textarea
                        id="interests"
                        placeholder="e.g., Technology, Music, Fitness, Gaming, Travel..."
                        className="bg-[#3f3f3f] border-[#4f4f4f] text-white placeholder-[#afafaf]"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="pain-points" className="text-[#afafaf]">
                        Pain Points & Problems
                      </Label>
                      <Textarea
                        id="pain-points"
                        placeholder="What problems does your product solve for customers?"
                        className="bg-[#3f3f3f] border-[#4f4f4f] text-white placeholder-[#afafaf]"
                      />
                    </div>
                  </CardContent>
                </Card>

                {/* Campaign Settings */}
                <Card className="bg-[#2b2b2b] border-[#3f3f3f]">
                  <CardHeader>
                    <CardTitle className="text-white flex items-center">
                      <Target className="h-5 w-5 mr-2" />
                      Campaign Settings
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="campaign-objective" className="text-[#afafaf]">
                        Campaign Objective
                      </Label>
                      <Select>
                        <SelectTrigger className="bg-[#3f3f3f] border-[#4f4f4f] text-white">
                          <SelectValue placeholder="Select objective" />
                        </SelectTrigger>
                        <SelectContent className="bg-[#3f3f3f] border-[#4f4f4f]">
                          <SelectItem value="awareness">Brand Awareness</SelectItem>
                          <SelectItem value="traffic">Website Traffic</SelectItem>
                          <SelectItem value="engagement">Engagement</SelectItem>
                          <SelectItem value="leads">Lead Generation</SelectItem>
                          <SelectItem value="conversions">Conversions</SelectItem>
                          <SelectItem value="sales">Sales</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="cta" className="text-[#afafaf]">
                        Call-to-Action
                      </Label>
                      <Select>
                        <SelectTrigger className="bg-[#3f3f3f] border-[#4f4f4f] text-white">
                          <SelectValue placeholder="Select CTA" />
                        </SelectTrigger>
                        <SelectContent className="bg-[#3f3f3f] border-[#4f4f4f]">
                          <SelectItem value="shop-now">Shop Now</SelectItem>
                          <SelectItem value="learn-more">Learn More</SelectItem>
                          <SelectItem value="sign-up">Sign Up</SelectItem>
                          <SelectItem value="download">Download</SelectItem>
                          <SelectItem value="get-quote">Get Quote</SelectItem>
                          <SelectItem value="contact-us">Contact Us</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="tone" className="text-[#afafaf]">
                        Brand Tone & Voice
                      </Label>
                      <Select>
                        <SelectTrigger className="bg-[#3f3f3f] border-[#4f4f4f] text-white">
                          <SelectValue placeholder="Select tone" />
                        </SelectTrigger>
                        <SelectContent className="bg-[#3f3f3f] border-[#4f4f4f]">
                          <SelectItem value="professional">Professional</SelectItem>
                          <SelectItem value="friendly">Friendly & Casual</SelectItem>
                          <SelectItem value="exciting">Exciting & Energetic</SelectItem>
                          <SelectItem value="luxury">Luxury & Premium</SelectItem>
                          <SelectItem value="trustworthy">Trustworthy & Reliable</SelectItem>
                          <SelectItem value="playful">Playful & Fun</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-3">
                      <Label className="text-[#afafaf]">Additional Options</Label>
                      <div className="space-y-2">
                        <div className="flex items-center space-x-2">
                          <Checkbox id="urgency" className="border-[#4f4f4f]" />
                          <Label htmlFor="urgency" className="text-[#afafaf] text-sm">
                            Include urgency/scarcity elements
                          </Label>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Checkbox id="social-proof" className="border-[#4f4f4f]" />
                          <Label htmlFor="social-proof" className="text-[#afafaf] text-sm">
                            Add social proof/testimonials
                          </Label>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Checkbox id="guarantee" className="border-[#4f4f4f]" />
                          <Label htmlFor="guarantee" className="text-[#afafaf] text-sm">
                            Highlight guarantee/return policy
                          </Label>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Preview Section */}
              <div className="space-y-6">
                <Card className="bg-[#2b2b2b] border-[#3f3f3f]">
                  <CardHeader>
                    <CardTitle className="text-white flex items-center">
                      <Sparkles className="h-5 w-5 mr-2" />
                      AI-Generated Ad Preview
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {/* Mock Facebook Ad Preview */}
                    <div className="bg-[#3f3f3f] rounded-lg p-4 space-y-3">
                      <div className="flex items-center space-x-3">
                        <div className="w-10 h-10 bg-gradient-to-br from-[#a545b6] to-[#cd4f9d] rounded-full flex items-center justify-center">
                          <span className="text-white font-bold text-sm">B</span>
                        </div>
                        <div>
                          <p className="text-white font-semibold">Your Brand Name</p>
                          <p className="text-[#afafaf] text-sm">Sponsored</p>
                        </div>
                      </div>

                      <div className="bg-[#4f4f4f] rounded-lg h-48 flex items-center justify-center">
                        <div className="text-center text-[#afafaf]">
                          <ImageIcon className="h-12 w-12 mx-auto mb-2" />
                          <p>Product Image Preview</p>
                          <p className="text-sm">Will be generated by AI</p>
                        </div>
                      </div>

                      <div className="space-y-2">
                        <p className="text-white font-semibold">
                          🎧 Revolutionary Wireless Headphones - 50% OFF Today Only!
                        </p>
                        <p className="text-[#afafaf] text-sm">
                          Experience crystal-clear sound with our premium wireless headphones. Perfect for music lovers
                          and professionals. Limited time offer!
                        </p>
                        <div className="flex items-center space-x-4 text-sm text-[#afafaf]">
                          <span>👍 1.2K</span>
                          <span>💬 89</span>
                          <span>↗️ 45</span>
                        </div>
                      </div>

                      <Button className="w-full bg-[#1877f2] hover:bg-[#166fe5] text-white">Shop Now</Button>
                    </div>

                    <div className="text-center">
                      <p className="text-[#afafaf] text-sm mb-4">
                        Fill out the form to generate your custom ad with AI
                      </p>
                      <Button
                        className="w-full bg-gradient-to-r from-[#a545b6] to-[#cd4f9d] hover:from-[#a545b6]/90 hover:to-[#cd4f9d]/90"
                        size="lg"
                      >
                        <Wand2 className="h-5 w-5 mr-2" />
                        Generate Perfect Ad
                      </Button>
                    </div>
                  </CardContent>
                </Card>

                {/* Export Options */}
                <Card className="bg-[#2b2b2b] border-[#3f3f3f]">
                  <CardHeader>
                    <CardTitle className="text-white flex items-center">
                      <Download className="h-5 w-5 mr-2" />
                      Export Options
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <Button
                      variant="outline"
                      className="w-full border-[#4f4f4f] text-[#afafaf] hover:text-white hover:bg-[#3f3f3f] bg-transparent"
                    >
                      <Download className="h-4 w-4 mr-2" />
                      Download Ad Copy
                    </Button>
                    <Button
                      variant="outline"
                      className="w-full border-[#4f4f4f] text-[#afafaf] hover:text-white hover:bg-[#3f3f3f] bg-transparent"
                    >
                      <ImageIcon className="h-4 w-4 mr-2" />
                      Download Ad Image
                    </Button>
                    <Button
                      variant="outline"
                      className="w-full border-[#4f4f4f] text-[#afafaf] hover:text-white hover:bg-[#3f3f3f] bg-transparent"
                    >
                      <RefreshCw className="h-4 w-4 mr-2" />
                      Generate Variations
                    </Button>
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  )
}
