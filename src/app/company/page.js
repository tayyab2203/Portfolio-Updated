'use client';
import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Parallax } from 'react-parallax';
import { useInView } from '@/hooks/useInView';
import {
  Rocket,
  Users,
  DollarSign,
  Users2,
  Handshake,
  Award,
  Calendar,
  MapPin,
  Globe,
  Mail,
} from 'lucide-react';

const iconMap = {
  rocket: Rocket,
  users: Users,
  funding: DollarSign,
  team: Users2,
  partnership: Handshake,
  award: Award,
};

export default function Company() {
  const { ref: achievementsRef, inView: achievementsInView } = useInView({ threshold: 0.2 });
  const [companyData, setCompanyData] = useState(null);

  useEffect(() => {
    async function loadCompany() {
      try {
        const res = await fetch('/api/public/company');
        if (!res.ok) return;
        const data = await res.json();
        setCompanyData(data);
      } catch (error) {
        console.error('Failed to load company data from API:', error);
      }
    }

    loadCompany();
  }, []);

  if (!companyData) {
    return (
      <div className="min-h-screen bg-black text-almond_cream flex items-center justify-center">
        <p className="text-dry-sage-600">Loading company information...</p>
      </div>
    );
  }

  const { companyInfo, team, achievements, vision, mission, values, milestones } = companyData;

  return (
    <div className="min-h-screen bg-black text-almond_cream">
      {/* Hero Section */}
      <section className="relative">
        <Parallax strength={300}>
          <div className="h-[400px] md:h-[500px] bg-linear-to-br from-jet_black to-jet_black-300 flex items-center justify-center">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              className="text-center max-w-4xl mx-auto px-4"
            >
              <h1 className="text-4xl md:text-6xl font-bold mb-4 text-almond_cream font-comfortaa">
                {companyInfo.name}
              </h1>
              <p className="text-xl md:text-2xl text-almond_cream/70 mb-6">
                {companyInfo.description}
              </p>
              <div className="flex flex-wrap justify-center gap-6 text-almond_cream/60">
                <div className="flex items-center gap-2">
                  <Calendar size={20} />
                  <span>Founded {companyInfo.founded}</span>
                </div>
                <div className="flex items-center gap-2">
                  <MapPin size={20} />
                  <span>{companyInfo.location}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Users size={20} />
                  <span>{team.total} Team Members</span>
                </div>
              </div>
            </motion.div>
          </div>
        </Parallax>
      </section>

      <div className="max-w-6xl mx-auto px-4 py-20">
        {/* Company Info */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="mb-20"
        >
          <div className="grid md:grid-cols-2 gap-12">
            <div>
              <h2 className="text-3xl font-bold mb-6 text-khaki-beige font-comfortaa">
                About {companyInfo.name}
              </h2>
              <p className="text-almond_cream/80 leading-relaxed mb-4">
                {companyInfo.description}
              </p>
              <p className="text-almond_cream/80 leading-relaxed mb-6">
                We specialize in creating innovative solutions that leverage artificial
                intelligence and modern web technologies to solve complex business challenges. Our
                team of experienced developers, designers, and strategists work together to deliver
                products that make a real impact.
              </p>
              <div className="flex flex-wrap gap-4">
                {companyInfo.website && (
                  <a
                    href={companyInfo.website}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2 text-stone_brown hover:text-khaki-beige transition"
                  >
                    <Globe size={20} />
                    <span>Visit Website</span>
                  </a>
                )}
                {companyInfo.email && (
                  <a
                    href={`mailto:${companyInfo.email}`}
                    className="flex items-center gap-2 text-stone_brown hover:text-khaki-beige transition"
                  >
                    <Mail size={20} />
                    <span>Contact Us</span>
                  </a>
                )}
              </div>
            </div>

            <div className="bg-jet_black/50 p-8 rounded-lg border border-stone_brown/20">
              <h3 className="text-2xl font-bold mb-6 text-almond_cream">Company Details</h3>
              <div className="space-y-4">
                <div>
                  <span className="text-khaki-beige font-semibold">Industry:</span>
                  <span className="text-almond_cream/80 ml-2">{companyInfo.industry}</span>
                </div>
                <div>
                  <span className="text-khaki-beige font-semibold">Founded:</span>
                  <span className="text-almond_cream/80 ml-2">{companyInfo.founded}</span>
                </div>
                <div>
                  <span className="text-khaki-beige font-semibold">Location:</span>
                  <span className="text-almond_cream/80 ml-2">{companyInfo.location}</span>
                </div>
                <div>
                  <span className="text-khaki-beige font-semibold">Team Size:</span>
                  <span className="text-almond_cream/80 ml-2">{team.total} members</span>
                </div>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Team Structure */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="mb-20"
        >
          <h2 className="text-3xl font-bold mb-8 text-almond_cream font-comfortaa">
            Our Team
          </h2>
          <div className="grid md:grid-cols-2 gap-6">
            {team.departments.map((dept, index) => (
              <motion.div
                key={dept.name}
                initial={{ opacity: 0, x: -30 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                className="bg-jet_black/50 p-6 rounded-lg border border-stone_brown/20"
              >
                <div className="flex items-center justify-between mb-3">
                  <h3 className="text-xl font-bold text-khaki-beige">{dept.name}</h3>
                  <span className="text-stone_brown font-bold text-lg">{dept.size}</span>
                </div>
                <p className="text-almond_cream/70">{dept.description}</p>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Achievements */}
        <motion.div
          ref={achievementsRef}
          initial={{ opacity: 0 }}
          animate={achievementsInView ? { opacity: 1 } : { opacity: 0 }}
          transition={{ duration: 0.8 }}
          className="mb-20"
        >
          <h2 className="text-3xl font-bold mb-8 text-almond_cream font-comfortaa">
            Key Achievements
          </h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {achievements.map((achievement, index) => {
              const Icon = iconMap[achievement.icon] || Award;
              return (
                <motion.div
                  key={achievement.title}
                  initial={{ opacity: 0, y: 30 }}
                  animate={achievementsInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                  className="bg-jet_black/50 p-6 rounded-lg border border-stone_brown/20 hover:border-stone_brown/40 transition-all duration-300"
                >
                  <div className="bg-stone_brown/20 p-3 rounded-lg w-fit mb-4">
                    <Icon className="text-stone_brown" size={24} />
                  </div>
                  <h3 className="text-xl font-bold text-almond_cream mb-2">
                    {achievement.title}
                  </h3>
                  <p className="text-almond_cream/70 mb-2">{achievement.description}</p>
                  <span className="text-stone_brown text-sm">{achievement.year}</span>
                </motion.div>
              );
            })}
          </div>
        </motion.div>

        {/* Vision & Mission */}
        <div className="grid md:grid-cols-2 gap-8 mb-20">
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="bg-linear-to-br from-jet_black to-jet_black-300 p-8 rounded-lg border border-stone_brown/30"
          >
            <h2 className="text-2xl font-bold mb-4 text-khaki-beige font-comfortaa">
              {vision.title}
            </h2>
            <p className="text-almond_cream/80 leading-relaxed">{vision.content}</p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="bg-linear-to-br from-jet_black to-jet_black-300 p-8 rounded-lg border border-stone_brown/30"
          >
            <h2 className="text-2xl font-bold mb-4 text-khaki-beige font-comfortaa">
              {mission.title}
            </h2>
            <p className="text-almond_cream/80 leading-relaxed">{mission.content}</p>
          </motion.div>
        </div>

        {/* Values */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="mb-20"
        >
          <h2 className="text-3xl font-bold mb-8 text-almond_cream font-comfortaa">
            Our Values
          </h2>
          <div className="grid md:grid-cols-2 gap-6">
            {values.map((value, index) => (
              <motion.div
                key={value.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                className="bg-jet_black/50 p-6 rounded-lg border border-stone_brown/20"
              >
                <h3 className="text-xl font-bold text-khaki-beige mb-2">{value.title}</h3>
                <p className="text-almond_cream/80">{value.description}</p>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Milestones Timeline */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
        >
          <h2 className="text-3xl font-bold mb-8 text-almond_cream font-comfortaa">
            Our Journey
          </h2>
          <div className="relative">
            <div className="absolute left-8 top-0 bottom-0 w-0.5 bg-stone_brown/30 hidden md:block" />
            <div className="space-y-8">
              {milestones.map((milestone, index) => (
                <motion.div
                  key={milestone.date}
                  initial={{ opacity: 0, x: -50 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                  className="relative pl-16 md:pl-0"
                >
                  <div className="absolute left-6 md:left-6 top-2 w-4 h-4 bg-stone_brown rounded-full border-4 border-jet_black z-10 hidden md:block" />
                  <div className="bg-jet_black/50 p-6 rounded-lg border border-stone_brown/20">
                    <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-3">
                      <h3 className="text-xl font-bold text-almond_cream mb-2 md:mb-0">
                        {milestone.title}
                      </h3>
                      <span className="text-khaki-beige text-sm">{milestone.date}</span>
                    </div>
                    <p className="text-almond_cream/80">{milestone.description}</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}

