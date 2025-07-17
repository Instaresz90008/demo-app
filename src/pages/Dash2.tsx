
import { useState, useEffect } from "react";
import Layout from "@/components/layout/Layout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  Calendar, Clock, Users, DollarSign, Sparkles, 
  TrendingUp, Target, Zap, Layers
} from "lucide-react";
import { motion } from "framer-motion";

const Dash2 = () => {
  const [userName] = useState("Anilkumar");
  const [greeting, setGreeting] = useState("Good day");

  useEffect(() => {
    const hour = new Date().getHours();
    if (hour < 12) setGreeting("Good Morning");
    else if (hour < 18) setGreeting("Good Afternoon");
    else setGreeting("Good Evening");
  }, []);

  return (
    <Layout title="Dash-2">
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-black p-6">
        {/* Animated Background Grid */}
        <div className="fixed inset-0 pointer-events-none">
          <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:50px_50px] [mask-image:radial-gradient(ellipse_50%_50%_at_50%_50%,black_40%,transparent_100%)]"></div>
        </div>

        {/* Neon Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="relative mb-8 p-8 rounded-2xl bg-gray-800/50 backdrop-blur-sm border border-cyan-500/20 shadow-[0_0_30px_rgba(6,182,212,0.3)]"
        >
          <div className="absolute inset-0 bg-gradient-to-r from-cyan-500/5 to-blue-500/5 rounded-2xl"></div>
          <div className="relative z-10">
            <h1 className="text-5xl font-bold mb-2">
              <span className="bg-gradient-to-r from-cyan-400 via-blue-400 to-purple-400 bg-clip-text text-transparent">
                {greeting}
              </span>
              <span className="text-white">, {userName}</span>
            </h1>
            <p className="text-gray-400 text-xl">Cyberpunk-inspired dashboard interface</p>
            <div className="flex items-center space-x-4 mt-4">
              <Badge className="bg-cyan-500/20 text-cyan-400 border border-cyan-500/30 px-4 py-2">
                <Zap className="w-4 h-4 mr-2" />
                Neural Link Active
              </Badge>
              <Button className="bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-700 hover:to-blue-700 text-white px-6 py-3 rounded-xl shadow-[0_0_20px_rgba(6,182,212,0.4)] transition-all duration-300">
                <Target className="w-5 h-5 mr-2" />
                Execute Command
              </Button>
            </div>
          </div>
        </motion.div>

        {/* Neon Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {[
            { title: "System Load", value: "78%", icon: Zap, glow: "cyan", border: "border-cyan-500/30" },
            { title: "Active Sessions", value: "342", icon: Users, glow: "blue", border: "border-blue-500/30" },
            { title: "Data Processed", value: "1.2TB", icon: Layers, glow: "purple", border: "border-purple-500/30" },
            { title: "Efficiency Rate", value: "99.7%", icon: TrendingUp, glow: "green", border: "border-green-500/30" }
          ].map((stat, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: index * 0.1 }}
              whileHover={{ scale: 1.05 }}
              className="group"
            >
              <Card className={`relative overflow-hidden bg-gray-900/70 backdrop-blur-sm border ${stat.border} hover:shadow-[0_0_30px_rgba(6,182,212,0.3)] transition-all duration-300`}>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between mb-4">
                    <div className={`p-3 rounded-xl bg-${stat.glow}-500/20 border border-${stat.glow}-500/30`}>
                      <stat.icon className={`w-6 h-6 text-${stat.glow}-400`} />
                    </div>
                    <div className={`w-2 h-2 bg-${stat.glow}-400 rounded-full animate-pulse`}></div>
                  </div>
                  <h3 className="text-3xl font-bold text-white mb-1 font-mono">{stat.value}</h3>
                  <p className="text-gray-400 uppercase text-xs tracking-wider">{stat.title}</p>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>

        {/* Terminal-style Main Content */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
          >
            <Card className="bg-black/80 backdrop-blur-sm border border-green-500/30 shadow-[0_0_30px_rgba(34,197,94,0.2)]">
              <CardHeader className="border-b border-green-500/20">
                <CardTitle className="text-green-400 font-mono flex items-center">
                  <span className="w-3 h-3 bg-green-400 rounded-full mr-2 animate-pulse"></span>
                  system.analytics.exe
                </CardTitle>
              </CardHeader>
              <CardContent className="p-6 font-mono text-green-300 space-y-2">
                <div className="typing-animation">
                  <p>{">"} Initializing neural networks...</p>
                  <p>{">"} Loading data matrices...</p>
                  <p>{">"} Analyzing patterns...</p>
                  <p className="text-cyan-400">{">"} ANALYSIS COMPLETE</p>
                </div>
                <div className="mt-6 p-4 bg-green-500/10 border border-green-500/20 rounded">
                  <p className="text-white">Performance metrics exceed baseline by 247%</p>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
          >
            <Card className="bg-gray-900/80 backdrop-blur-sm border border-purple-500/30">
              <CardHeader>
                <CardTitle className="text-purple-400 flex items-center">
                  <Sparkles className="w-5 h-5 mr-2" />
                  Quantum Dashboard
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {["Neural Processing", "Data Synthesis", "Pattern Recognition", "Quantum Computing"].map((item, i) => (
                  <div key={i} className="flex items-center justify-between p-3 bg-purple-500/10 border border-purple-500/20 rounded">
                    <span className="text-purple-300">{item}</span>
                    <div className="w-24 h-2 bg-gray-700 rounded-full overflow-hidden">
                      <motion.div
                        className="h-full bg-gradient-to-r from-purple-500 to-cyan-500"
                        initial={{ width: 0 }}
                        animate={{ width: `${Math.random() * 80 + 20}%` }}
                        transition={{ delay: i * 0.2 }}
                      ></motion.div>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </div>
    </Layout>
  );
};

export default Dash2;
