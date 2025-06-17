import { Header } from "@/components/layout/header"
import { Footer } from "@/components/layout/footer"
import { Shield, Users, Award, Clock, CheckCircle, Star } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"

const stats = [
  { label: "Years of Experience", value: "15+" },
  { label: "Happy Customers", value: "10,000+" },
  { label: "Security Systems Installed", value: "25,000+" },
  { label: "24/7 Support", value: "Available" },
]

const values = [
  {
    icon: Shield,
    title: "Security First",
    description:
      "We prioritize your safety above all else, using cutting-edge technology to protect what matters most.",
  },
  {
    icon: Users,
    title: "Customer Focused",
    description: "Our dedicated team is committed to providing exceptional service and support to every customer.",
  },
  {
    icon: Award,
    title: "Industry Leading",
    description: "Recognized as a leader in home security with multiple industry awards and certifications.",
  },
  {
    icon: Clock,
    title: "Always Available",
    description: "Round-the-clock monitoring and support to ensure your home is protected 24/7.",
  },
]

const team = [
  {
    name: "John Smith",
    role: "CEO & Founder",
    image: "/placeholder.svg?height=300&width=300",
    bio: "15+ years in security industry, passionate about protecting families.",
  },
  {
    name: "Sarah Johnson",
    role: "Head of Technology",
    image: "/placeholder.svg?height=300&width=300",
    bio: "Expert in IoT and smart home security systems.",
  },
  {
    name: "Mike Davis",
    role: "Customer Success Manager",
    image: "/placeholder.svg?height=300&width=300",
    bio: "Dedicated to ensuring every customer feels safe and supported.",
  },
]

const certifications = [
  "UL Listed Products",
  "FCC Certified",
  "ISO 27001 Compliant",
  "NIST Cybersecurity Framework",
  "Better Business Bureau A+",
]

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-background">
      <Header />

      <main>
        {/* Hero Section */}
        <section className="py-20 bg-gradient-to-br from-blue-50 to-indigo-100">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto text-center">
              <h1 className="text-4xl md:text-6xl font-bold text-gray-900 mb-6">Protecting Homes Since 2008</h1>
              <p className="text-xl text-gray-600 mb-8 leading-relaxed">
                We're more than just a security company. We're your partners in creating a safer, smarter home
                environment for you and your loved ones.
              </p>
              <div className="flex items-center justify-center space-x-2">
                <div className="flex">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="h-5 w-5 fill-yellow-400 text-yellow-400" />
                  ))}
                </div>
                <span className="text-gray-600">Trusted by 10,000+ families</span>
              </div>
            </div>
          </div>
        </section>

        {/* Stats Section */}
        <section className="py-16 bg-white">
          <div className="container mx-auto px-4">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
              {stats.map((stat, index) => (
                <div key={index} className="text-center">
                  <div className="text-3xl md:text-4xl font-bold text-primary mb-2">{stat.value}</div>
                  <div className="text-gray-600">{stat.label}</div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Our Story Section */}
        <section className="py-20 bg-gray-50">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto">
              <h2 className="text-3xl md:text-4xl font-bold text-center mb-12">Our Story</h2>
              <div className="prose prose-lg mx-auto text-gray-600">
                <p className="text-xl leading-relaxed mb-6">
                  Founded in 2008 by security industry veterans, SecureHome was born from a simple belief: every family
                  deserves to feel safe in their own home. What started as a small local business has grown into a
                  trusted name in home security across the nation.
                </p>
                <p className="text-lg leading-relaxed mb-6">
                  Our journey began when our founder experienced a break-in at his own home. Frustrated by the
                  complexity and high costs of existing security solutions, he set out to create something better –
                  affordable, reliable, and easy-to-use security systems that actually work.
                </p>
                <p className="text-lg leading-relaxed">
                  Today, we continue to innovate and evolve, incorporating the latest technology while maintaining our
                  commitment to exceptional customer service and affordable pricing.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Values Section */}
        <section className="py-20 bg-white">
          <div className="container mx-auto px-4">
            <h2 className="text-3xl md:text-4xl font-bold text-center mb-12">Our Values</h2>
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
              {values.map((value, index) => (
                <Card key={index} className="text-center p-6">
                  <CardContent className="pt-6">
                    <value.icon className="h-12 w-12 text-primary mx-auto mb-4" />
                    <h3 className="text-xl font-semibold mb-3">{value.title}</h3>
                    <p className="text-gray-600">{value.description}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* Team Section */}
        <section className="py-20 bg-gray-50">
          <div className="container mx-auto px-4">
            <h2 className="text-3xl md:text-4xl font-bold text-center mb-12">Meet Our Team</h2>
            <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
              {team.map((member, index) => (
                <Card key={index} className="text-center">
                  <CardContent className="pt-6">
                    <img
                      src={member.image || "/placeholder.svg"}
                      alt={member.name}
                      className="w-32 h-32 rounded-full mx-auto mb-4 object-cover"
                    />
                    <h3 className="text-xl font-semibold mb-1">{member.name}</h3>
                    <p className="text-primary font-medium mb-3">{member.role}</p>
                    <p className="text-gray-600 text-sm">{member.bio}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* Certifications Section */}
        <section className="py-20 bg-white">
          <div className="container mx-auto px-4">
            <h2 className="text-3xl md:text-4xl font-bold text-center mb-12">Certifications & Awards</h2>
            <div className="max-w-4xl mx-auto">
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                {certifications.map((cert, index) => (
                  <div key={index} className="flex items-center space-x-3 p-4 bg-gray-50 rounded-lg">
                    <CheckCircle className="h-5 w-5 text-green-500 flex-shrink-0" />
                    <span className="font-medium">{cert}</span>
                  </div>
                ))}
              </div>
              <div className="text-center mt-8">
                <Badge variant="outline" className="text-lg px-4 py-2">
                  A+ Rating with Better Business Bureau
                </Badge>
              </div>
            </div>
          </div>
        </section>

        {/* Mission Section */}
        <section className="py-20 bg-primary text-white">
          <div className="container mx-auto px-4 text-center">
            <h2 className="text-3xl md:text-4xl font-bold mb-8">Our Mission</h2>
            <p className="text-xl max-w-3xl mx-auto leading-relaxed">
              To provide innovative, reliable, and affordable home security solutions that give families peace of mind
              and protect what matters most to them.
            </p>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  )
}
