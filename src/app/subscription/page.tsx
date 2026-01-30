"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import {
  Check,
  Star,
  Zap,
  Crown,
  Sparkles,
  ArrowRight,
  CreditCard
} from "lucide-react";

import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";

const plans = [
  {
    id: "starter",
    name: "Starter",
    price: 0,
    period: "month",
    description: "Perfect for individuals getting started",
    features: [
      "Connect up to 3 social accounts",
      "Schedule 10 posts per month",
      "Basic analytics",
      "Community support",
      "Mobile app access"
    ],
    limitations: [
      "Limited to 3 platforms",
      "Basic scheduling only",
      "No team collaboration"
    ],
    popular: false,
    icon: Sparkles
  },
  {
    id: "professional",
    name: "Professional",
    price: 29,
    period: "month",
    description: "Ideal for growing businesses and creators",
    features: [
      "Connect up to 10 social accounts",
      "Unlimited post scheduling",
      "Advanced analytics & insights",
      "Team collaboration (up to 3 members)",
      "Custom branding",
      "Priority support",
      "Hashtag suggestions",
      "Content calendar"
    ],
    limitations: [
      "Limited team size",
      "No white-label options"
    ],
    popular: true,
    icon: Zap
  },
  {
    id: "enterprise",
    name: "Enterprise",
    price: 99,
    period: "month",
    description: "For large teams and agencies",
    features: [
      "Unlimited social accounts",
      "Unlimited post scheduling",
      "Advanced analytics & reporting",
      "Team collaboration (unlimited members)",
      "White-label solution",
      "Dedicated account manager",
      "API access",
      "Custom integrations",
      "Advanced automation",
      "24/7 phone support"
    ],
    limitations: [],
    popular: false,
    icon: Crown
  }
];

const billingCycles = [
  { id: "monthly", label: "Monthly", discount: 0 },
  { id: "yearly", label: "Yearly", discount: 20 }
];

export default function SubscriptionPage() {
  const [billingCycle, setBillingCycle] = useState("monthly");
  const [selectedPlan, setSelectedPlan] = useState("professional");

  const getPrice = (plan: typeof plans[0]) => {
    const basePrice = plan.price;
    if (billingCycle === "yearly" && basePrice > 0) {
      return Math.round(basePrice * 12 * (1 - billingCycles[1].discount / 100));
    }
    return basePrice;
  };

  const getSavings = (plan: typeof plans[0]) => {
    if (billingCycle === "yearly" && plan.price > 0) {
      const monthlyTotal = plan.price * 12;
      const yearlyPrice = getPrice(plan);
      return monthlyTotal - yearlyPrice;
    }
    return 0;
  };

  return (
    <div className="space-y-8">
      <div className="text-center space-y-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <h1 className="text-4xl font-bold text-white mb-4">
            Choose Your Plan
          </h1>
          <p className="text-xl text-gray-400 max-w-2xl mx-auto">
            Unlock the full potential of your social media management with our flexible pricing plans
          </p>
        </motion.div>

        {/* Billing Toggle */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="flex items-center justify-center gap-4 mt-8"
        >
          <div className="flex items-center bg-white/5 rounded-lg p-1 border border-white/10">
            {billingCycles.map((cycle) => (
              <button
                key={cycle.id}
                onClick={() => setBillingCycle(cycle.id)}
                className={`px-6 py-2 rounded-md text-sm font-medium transition-all ${
                  billingCycle === cycle.id
                    ? "bg-purple-500 text-white"
                    : "text-gray-400 hover:text-white"
                }`}
              >
                {cycle.label}
                {cycle.discount > 0 && (
                  <Badge variant="success" size="sm" className="ml-2">
                    Save {cycle.discount}%
                  </Badge>
                )}
              </button>
            ))}
          </div>
        </motion.div>
      </div>

      {/* Pricing Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-7xl mx-auto">
        {plans.map((plan, index) => {
          const Icon = plan.icon;
          const price = getPrice(plan);
          const savings = getSavings(plan);

          return (
            <motion.div
              key={plan.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="relative"
            >
              {plan.popular && (
                <div className="absolute -top-4 left-1/2 -translate-x-1/2 z-10">
                  <Badge variant="info" className="flex items-center gap-1">
                    <Star className="w-3 h-3" />
                    Most Popular
                  </Badge>
                </div>
              )}

              <Card
                className={`h-full relative overflow-hidden ${
                  selectedPlan === plan.id
                    ? "ring-2 ring-purple-500 border-purple-500/50"
                    : ""
                }`}
                gradientBorder={plan.popular}
                hoverLift
              >
                <div className="text-center pb-6">
                  <div className="flex justify-center mb-4">
                    <div className={`p-3 rounded-xl ${
                      plan.popular
                        ? "bg-gradient-to-r from-purple-500 to-pink-500"
                        : "bg-white/10"
                    }`}>
                      <Icon className="w-6 h-6 text-white" />
                    </div>
                  </div>

                  <h3 className="text-2xl font-bold text-white">{plan.name}</h3>
                  <p className="text-gray-400 mt-2">
                    {plan.description}
                  </p>

                  <div className="mt-4">
                    <div className="flex items-baseline justify-center gap-1">
                      <span className="text-4xl font-bold text-white">
                        ${price}
                      </span>
                      <span className="text-gray-400">
                        /{billingCycle === "yearly" ? "year" : "month"}
                      </span>
                    </div>
                    {savings > 0 && (
                      <p className="text-sm text-green-400 mt-1">
                        Save ${savings} per year
                      </p>
                    )}
                  </div>
                </div>

                <div className="px-6 pb-6 space-y-4">
                  <div className="space-y-3">
                    {plan.features.map((feature, featureIndex) => (
                      <div key={featureIndex} className="flex items-start gap-3">
                        <Check className="w-4 h-4 text-green-400 mt-0.5 flex-shrink-0" />
                        <span className="text-sm text-gray-300">{feature}</span>
                      </div>
                    ))}
                  </div>

                  {plan.limitations.length > 0 && (
                    <div className="pt-4 border-t border-white/10">
                      <p className="text-xs text-gray-500 mb-2">Limitations:</p>
                      <div className="space-y-2">
                        {plan.limitations.map((limitation, limitIndex) => (
                          <div key={limitIndex} className="flex items-start gap-3">
                            <div className="w-4 h-4 rounded-full bg-gray-600 mt-0.5 flex-shrink-0" />
                            <span className="text-xs text-gray-500">{limitation}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  <div className="pt-6">
                    <Button
                      variant={plan.popular ? "primary" : "secondary"}
                      size="lg"
                      fullWidth
                      onClick={() => setSelectedPlan(plan.id)}
                      className="group"
                    >
                      {plan.price === 0 ? (
                        "Get Started Free"
                      ) : (
                        <div className="flex items-center gap-2">
                          Choose {plan.name}
                          <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                        </div>
                      )}
                    </Button>
                  </div>
                </div>
              </Card>
            </motion.div>
          );
        })}
      </div>

      {/* FAQ Section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.4 }}
        className="max-w-4xl mx-auto"
      >
        <Card padding="lg">
          <h2 className="text-2xl font-bold text-white mb-6 text-center">
            Frequently Asked Questions
          </h2>

          <div className="space-y-6">
            <div className="border-b border-white/10 pb-4">
              <h3 className="text-lg font-semibold text-white mb-2">
                Can I change my plan anytime?
              </h3>
              <p className="text-gray-400">
                Yes, you can upgrade or downgrade your plan at any time. Changes will be reflected in your next billing cycle.
              </p>
            </div>

            <div className="border-b border-white/10 pb-4">
              <h3 className="text-lg font-semibold text-white mb-2">
                Is there a free trial?
              </h3>
              <p className="text-gray-400">
                Yes! Our Starter plan is completely free, and you can upgrade to a paid plan at any time without losing your data.
              </p>
            </div>

            <div className="border-b border-white/10 pb-4">
              <h3 className="text-lg font-semibold text-white mb-2">
                What payment methods do you accept?
              </h3>
              <p className="text-gray-400">
                We accept all major credit cards, PayPal, and bank transfers for Enterprise customers.
              </p>
            </div>

            <div>
              <h3 className="text-lg font-semibold text-white mb-2">
                Do you offer refunds?
              </h3>
              <p className="text-gray-400">
                We offer a 30-day money-back guarantee for all paid plans. If you&apos;re not satisfied, we&apos;ll refund your payment.
              </p>
            </div>
          </div>
        </Card>
      </motion.div>

      {/* CTA Section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.5 }}
        className="text-center"
      >
        <Card className="bg-gradient-to-r from-purple-500/20 to-pink-500/20 border-purple-500/30" padding="lg">
          <div className="flex items-center justify-center gap-3 mb-4">
            <CreditCard className="w-6 h-6 text-purple-300" />
            <h3 className="text-xl font-semibold text-white">Need a Custom Plan?</h3>
          </div>
          <p className="text-gray-300 mb-6 max-w-2xl mx-auto">
            Have specific requirements for your team or agency? Contact us for a custom enterprise solution tailored to your needs.
          </p>
          <Button variant="primary" size="lg" className="flex items-center gap-2">
            Contact Sales
            <ArrowRight className="w-4 h-4" />
          </Button>
        </Card>
      </motion.div>
    </div>
  );
}