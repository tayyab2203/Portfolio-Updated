'use client';
import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Image from 'next/image';
import { ExternalLink, Github, Users, TrendingUp, DollarSign, Target } from 'lucide-react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Pagination } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';

export default function ProjectCard({ project, index }) {
  const [isExpanded, setIsExpanded] = useState(false);
  const [imageErrors, setImageErrors] = useState({});

  return (
    <motion.div
      initial={{ opacity: 0, y: 50 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.6, delay: index * 0.1 }}
      className="bg-ebony/50 rounded-lg border border-dusty-olive/30 overflow-hidden hover:border-camel/50 transition-all duration-300 hover:shadow-xl"
    >
      {/* Image Showcase */}
      {project.images && project.images.length > 0 && (
        <div className="relative h-64 md:h-80 bg-charcoal-brown">
          <Swiper
            modules={[Navigation, Pagination]}
            navigation
            pagination={{ clickable: true }}
            className="h-full"
          >
            {project.images.map((img, idx) => (
              <SwiperSlide key={idx}>
                <div className="w-full h-full relative">
                  {imageErrors[idx] ? (
                    <div className="w-full h-full bg-linear-to-br from-toffee-brown/20 to-camel/10 flex items-center justify-center">
                      <span className="text-dry-sage-600">Project Image {idx + 1}</span>
                    </div>
                  ) : (
                    <img
                      src={img}
                      alt={`${project.title} - Image ${idx + 1}`}
                      className="w-full h-full object-cover"
                      onError={() => {
                        setImageErrors((prev) => ({ ...prev, [idx]: true }));
                      }}
                    />
                  )}
                </div>
              </SwiperSlide>
            ))}
          </Swiper>
          {project.featured && (
            <div className="absolute top-4 right-4 bg-linear-to-r from-toffee-brown to-saddle-brown px-3 py-1 rounded-full text-xs font-semibold text-khaki-beige-900">
              Featured
            </div>
          )}
        </div>
      )}

      <div className="p-6 md:p-8">
        {/* Title and Links */}
        <div className="flex items-start justify-between mb-4">
          <h3 className="text-2xl md:text-3xl font-bold text-khaki-beige-900 font-comfortaa">
            {project.title}
          </h3>
          <div className="flex gap-3 ml-4">
            {project.liveLink && (
              <a
                href={project.liveLink}
                target="_blank"
                rel="noopener noreferrer"
                className="text-toffee-brown hover:text-camel transition-colors duration-300"
                aria-label="View live demo"
              >
                <ExternalLink size={20} />
              </a>
            )}
            {project.githubLink && (
              <a
                href={project.githubLink}
                target="_blank"
                rel="noopener noreferrer"
                className="text-toffee-brown hover:text-camel transition-colors duration-300"
                aria-label="View on GitHub"
              >
                <Github size={20} />
              </a>
            )}
          </div>
        </div>

        {/* Case Study Format */}
        <div className="space-y-4 mb-6">
          <div>
            <h4 className="text-camel font-semibold mb-2 flex items-center gap-2">
              <span className="text-toffee-brown">Problem:</span>
            </h4>
            <p className="text-dry-sage-700 leading-relaxed">{project.problem}</p>
          </div>

          <AnimatePresence>
            {isExpanded && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                transition={{ duration: 0.3 }}
                className="space-y-4"
              >
                <div>
                  <h4 className="text-camel font-semibold mb-2 flex items-center gap-2">
                    <span className="text-toffee-brown">Solution:</span>
                  </h4>
                  <p className="text-dry-sage-700 leading-relaxed">{project.solution}</p>
                </div>

                <div>
                  <h4 className="text-camel font-semibold mb-2 flex items-center gap-2">
                    <span className="text-toffee-brown">Impact:</span>
                  </h4>
                  <p className="text-dry-sage-700 leading-relaxed">{project.impact}</p>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Metrics Display */}
        {project.metrics && (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6 p-4 bg-charcoal-brown/50 rounded-lg border border-dusty-olive/20">
            {project.metrics.users && (
              <div className="text-center">
                <Users className="text-toffee-brown mx-auto mb-2" size={24} />
                <div className="text-xl font-bold text-khaki-beige-900">
                  {typeof project.metrics.users === 'number'
                    ? project.metrics.users.toLocaleString()
                    : project.metrics.users}
                </div>
                <div className="text-xs text-dry-sage-600">Users</div>
              </div>
            )}
            {project.metrics.revenue && (
              <div className="text-center">
                <DollarSign className="text-toffee-brown mx-auto mb-2" size={24} />
                <div className="text-xl font-bold text-khaki-beige-900">
                  {project.metrics.revenue}
                </div>
                <div className="text-xs text-dry-sage-600">Revenue</div>
              </div>
            )}
            {project.metrics.growth && (
              <div className="text-center">
                <TrendingUp className="text-toffee-brown mx-auto mb-2" size={24} />
                <div className="text-xl font-bold text-khaki-beige-900">
                  {project.metrics.growth}
                </div>
                <div className="text-xs text-dry-sage-600">Growth</div>
              </div>
            )}
            {project.metrics.retention && (
              <div className="text-center">
                <Target className="text-toffee-brown mx-auto mb-2" size={24} />
                <div className="text-xl font-bold text-khaki-beige-900">
                  {project.metrics.retention}
                </div>
                <div className="text-xs text-dry-sage-600">Retention</div>
              </div>
            )}
            {project.metrics.conversion && (
              <div className="text-center">
                <Target className="text-toffee-brown mx-auto mb-2" size={24} />
                <div className="text-xl font-bold text-khaki-beige-900">
                  {project.metrics.conversion}
                </div>
                <div className="text-xs text-dry-sage-600">Conversion</div>
              </div>
            )}
            {project.metrics.satisfaction && (
              <div className="text-center">
                <Target className="text-toffee-brown mx-auto mb-2" size={24} />
                <div className="text-xl font-bold text-khaki-beige-900">
                  {project.metrics.satisfaction}
                </div>
                <div className="text-xs text-dry-sage-600">Satisfaction</div>
              </div>
            )}
            {project.metrics.completion && (
              <div className="text-center">
                <Target className="text-toffee-brown mx-auto mb-2" size={24} />
                <div className="text-xl font-bold text-khaki-beige-900">
                  {project.metrics.completion}
                </div>
                <div className="text-xs text-dry-sage-600">Completion</div>
              </div>
            )}
            {project.metrics.performance && (
              <div className="text-center">
                <Target className="text-toffee-brown mx-auto mb-2" size={24} />
                <div className="text-xl font-bold text-khaki-beige-900">
                  {project.metrics.performance}
                </div>
                <div className="text-xs text-dry-sage-600">Performance</div>
              </div>
            )}
          </div>
        )}

        {/* Tech Stack */}
        {project.techStack && (
          <div className="mb-6">
            <h4 className="text-camel font-semibold mb-3">Tech Stack</h4>
            <div className="flex flex-wrap gap-2">
              {project.techStack.map((tech, idx) => (
                <span
                  key={idx}
                  className="px-3 py-1 bg-charcoal-brown/50 border border-dusty-olive/30 rounded-full text-sm text-dry-sage-700 hover:border-camel/50 transition-colors"
                >
                  {tech}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* Expand/Collapse Button */}
        <button
          onClick={() => setIsExpanded(!isExpanded)}
          className="w-full py-2 px-4 bg-linear-to-r from-toffee-brown/20 to-camel/20 hover:from-toffee-brown/30 hover:to-camel/30 text-khaki-beige-900 rounded-lg transition-all duration-300 font-semibold border border-camel/30 hover:border-camel/50"
        >
          {isExpanded ? 'Show Less' : 'Read Full Case Study'}
        </button>
      </div>
    </motion.div>
  );
}

