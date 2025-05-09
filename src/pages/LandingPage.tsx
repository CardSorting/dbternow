import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import LandingNavbar from '../components/layouts/LandingNavbar';

const LandingPage: React.FC = () => {
  // Fade-in animation effect for elements with data-aos attribute
  useEffect(() => {
    const fadeInElements = document.querySelectorAll('[data-aos]');
    
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('aos-animate');
        }
      });
    }, { threshold: 0.1 });
    
    fadeInElements.forEach(element => {
      observer.observe(element);
    });
    
    return () => {
      fadeInElements.forEach(element => {
        observer.unobserve(element);
      });
    };
  }, []);
  return (
    <div className="flex flex-col min-h-screen">
      <LandingNavbar />
      {/* Hero Section with enhanced styling */}
      <section className="relative py-24 overflow-hidden">
        {/* Background with pattern overlay */}
        <div className="absolute inset-0 bg-gradient-to-r from-blue-700 to-blue-900 opacity-90">
          <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiNmZmZmZmYiIGZpbGwtb3BhY2l0eT0iMC4wNSI+PHBhdGggZD0iTTM2IDM0aDR2MWgtNHYtMXptMC0yaDF2LTJoLTF2MnptLTUtNWgxdjFoLTF2LTF6bTAgM2gxdjFoLTF2LTF6TTI0IDMwaDR2MWgtNHYtMXptMC0yaDF2LTJoLTF2MnptLTUtNWgxdjFoLTF2LTF6bTAgM2gxdjFoLTF2LTF6TTE0IDIwaDR2MWgtNHYtMXptMC0yaDF2LTJoLTF2MnptLTUtNWgxdjFoLTF2LTF6bTAgM2gxdjFoLTF2LTF6Ii8+PC9nPjwvZz48L3N2Zz4=')] opacity-20"></div>
        </div>
        
        <div className="container relative mx-auto px-4 sm:px-6 lg:px-8 flex flex-col lg:flex-row items-center z-10">
          {/* Hero Content */}
          <div className="max-w-3xl lg:w-1/2 text-center lg:text-left mb-12 lg:mb-0" data-aos="fade-right">
            <span className="inline-block py-1 px-3 rounded-full bg-blue-50 bg-opacity-20 text-white text-sm font-semibold mb-6 tracking-wide uppercase">
              Dialectical Behavior Therapy
            </span>
            
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-white leading-tight mb-6">
              Build Skills for a <span className="text-blue-200">Life Worth Living</span>
            </h1>
            
            <p className="text-xl text-blue-100 mb-10 max-w-2xl mx-auto lg:mx-0">
              Learn evidence-based DBT skills through our interactive platform to manage emotions, improve relationships, and create a meaningful life.
            </p>
            
            <div className="flex flex-col sm:flex-row justify-center lg:justify-start gap-5">
              <Link
                to="/register"
                className="group relative inline-flex items-center justify-center px-8 py-4 font-bold tracking-wide text-blue-800 bg-white rounded-lg overflow-hidden shadow-lg transition-all duration-300 hover:shadow-xl hover:bg-blue-50 hover:scale-105"
              >
                <span className="relative z-10">Begin Your Healing Journey</span>
                <div className="absolute inset-0 -translate-x-full group-hover:translate-x-0 bg-gradient-to-r from-blue-50 to-white transition-transform duration-300 ease-out"></div>
              </Link>
              
              <Link
                to="/login"
                className="group relative inline-flex items-center justify-center px-8 py-4 font-bold tracking-wide text-white rounded-lg overflow-hidden shadow-lg border border-white/30 hover:border-white/80 transition-all duration-300 hover:shadow-xl hover:scale-105"
              >
                <span className="relative z-10">Continue Your Practice</span>
                <div className="absolute inset-0 opacity-0 group-hover:opacity-20 bg-white transition-opacity duration-300 ease-out"></div>
              </Link>
            </div>
          </div>
          
          {/* Hero Image/Illustration */}
          <div className="lg:w-1/2 lg:pl-12" data-aos="fade-left">
            <div className="relative">
              <div className="absolute -inset-1 bg-white/10 rounded-2xl blur-xl"></div>
              <div className="relative bg-blue-800/30 border border-white/10 backdrop-blur-sm rounded-2xl p-8 shadow-2xl">
                <svg className="w-full h-auto text-blue-100 opacity-70" viewBox="0 0 300 280" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <circle cx="150" cy="150" r="100" stroke="currentColor" strokeWidth="2" strokeDasharray="10 10"/>
                  <path d="M150 50 L150 250" stroke="currentColor" strokeWidth="2" strokeDasharray="8 8"/>
                  <path d="M50 150 L250 150" stroke="currentColor" strokeWidth="2" strokeDasharray="8 8"/>
                  <circle cx="150" cy="150" r="50" fill="currentColor" fillOpacity="0.1" stroke="currentColor" strokeWidth="2"/>
                  <circle cx="150" cy="100" r="20" fill="currentColor" fillOpacity="0.2"/>
                  <circle cx="200" cy="150" r="20" fill="currentColor" fillOpacity="0.2"/>
                  <circle cx="150" cy="200" r="20" fill="currentColor" fillOpacity="0.2"/>
                  <circle cx="100" cy="150" r="20" fill="currentColor" fillOpacity="0.2"/>
                </svg>
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="text-center">
                    <h3 className="text-white text-xl font-bold mb-2">Balance & Harmony</h3>
                    <p className="text-blue-100 text-sm">Finding the middle path</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        {/* Scroll indicator */}
        <div className="absolute bottom-5 left-1/2 transform -translate-x-1/2 flex flex-col items-center text-white/50">
          <span className="text-sm mb-2">Scroll to explore</span>
          <svg className="w-6 h-6 animate-bounce" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 14l-7 7m0 0l-7-7m7 7V3"></path>
          </svg>
        </div>
      </section>

      {/* Features Section with improved styling */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-center mb-4 text-gray-800" data-aos="fade-up">Four Core Skills of DBT</h2>
          <p className="text-gray-600 text-center max-w-3xl mx-auto mb-16" data-aos="fade-up" data-aos-delay="100">
            DBT teaches four sets of behavioral skills to help you manage emotions, handle distress, be more mindful, and communicate effectively.
          </p>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="bg-gradient-to-br from-blue-50 to-white p-8 rounded-xl shadow-md hover:shadow-lg transition-all duration-300 border border-blue-100 transform hover:-translate-y-1" data-aos="fade-up" data-aos-delay="150">
              <div className="text-blue-600 mb-6 flex justify-center">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold mb-3 text-gray-800 text-center">Mindfulness</h3>
              <p className="text-gray-600">
                Learn to be fully aware and present in the moment without judgment or criticism of your experiences.
              </p>
            </div>
            <div className="bg-gradient-to-br from-blue-50 to-white p-8 rounded-xl shadow-md hover:shadow-lg transition-all duration-300 border border-blue-100 transform hover:-translate-y-1" data-aos="fade-up" data-aos-delay="200">
              <div className="text-blue-600 mb-6 flex justify-center">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold mb-3 text-gray-800 text-center">Distress Tolerance</h3>
              <p className="text-gray-600">
                Develop skills to tolerate and survive emotional crises, and accept reality as it is in the moment.
              </p>
            </div>
            <div className="bg-gradient-to-br from-blue-50 to-white p-8 rounded-xl shadow-md hover:shadow-lg transition-all duration-300 border border-blue-100 transform hover:-translate-y-1" data-aos="fade-up" data-aos-delay="250">
              <div className="text-blue-600 mb-6 flex justify-center">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold mb-3 text-gray-800 text-center">Emotion Regulation</h3>
              <p className="text-gray-600">
                Master techniques to change emotions that you want to change and reduce emotional vulnerability.
              </p>
            </div>
            <div className="bg-gradient-to-br from-blue-50 to-white p-8 rounded-xl shadow-md hover:shadow-lg transition-all duration-300 border border-blue-100 transform hover:-translate-y-1" data-aos="fade-up" data-aos-delay="300">
              <div className="text-blue-600 mb-6 flex justify-center">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold mb-3 text-gray-800 text-center">Interpersonal Effectiveness</h3>
              <p className="text-gray-600">
                Build skills to ask for what you need, set boundaries, and cope with interpersonal conflict.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works Section - Enhanced */}
      <section className="py-24 bg-gradient-to-b from-gray-50 to-white relative overflow-hidden">
        {/* Background dots pattern */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute inset-0" style={{ 
            backgroundImage: 'radial-gradient(#3B82F6 1px, transparent 1px)', 
            backgroundSize: '30px 30px' 
          }}></div>
        </div>
        
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="text-center max-w-3xl mx-auto mb-16" data-aos="fade-up">
            <span className="inline-block py-1 px-3 rounded-full bg-blue-100 text-blue-700 text-sm font-semibold mb-3 tracking-wide">
              STEP BY STEP
            </span>
            <h2 className="text-3xl sm:text-4xl font-bold mb-6 text-gray-800">Your Therapeutic Journey</h2>
            <p className="text-gray-600 text-lg">
              Our structured approach helps you progress through DBT skills systematically, building emotional strength and resilience along the way.
            </p>
          </div>
          
          <div className="max-w-5xl mx-auto">
            <div className="relative">
              {/* Progress Line */}
              <div className="hidden lg:block absolute left-1/2 transform -translate-x-1/2 h-full w-1 bg-blue-200"></div>
              
              {/* Steps */}
              <div className="space-y-16">
                <div className="flex flex-col lg:flex-row items-center" data-aos="fade-up">
                  <div className="lg:w-1/2 lg:pr-12 text-center lg:text-right order-2 lg:order-1">
                    <div className="bg-white p-6 rounded-xl shadow-md border border-blue-100 hover:shadow-lg transition-all duration-300">
                      <h3 className="text-xl font-semibold mb-3 text-gray-800">Learn Core Concepts</h3>
                      <p className="text-gray-600">Begin with the foundations of DBT, understanding its principles and how it can help you develop emotional regulation skills.</p>
                    </div>
                  </div>
                  <div className="mx-auto lg:mx-0 my-6 lg:my-0 order-1 lg:order-2">
                    <div className="bg-gradient-to-r from-blue-600 to-blue-700 text-white h-16 w-16 rounded-full flex items-center justify-center font-bold text-xl relative z-10 shadow-lg">
                      <span>1</span>
                      <div className="absolute -inset-2 rounded-full bg-blue-100 opacity-30 animate-pulse"></div>
                    </div>
                  </div>
                  <div className="lg:w-1/2 lg:pl-12 lg:hidden order-3">
                    {/* Mobile duplicate - hidden on desktop */}
                  </div>
                </div>
                
                <div className="flex flex-col lg:flex-row items-center" data-aos="fade-up" data-aos-delay="100">
                  <div className="lg:w-1/2 lg:pr-12 hidden lg:block">
                    {/* Desktop duplicate - hidden on mobile */}
                  </div>
                  <div className="mx-auto lg:mx-0 my-6 lg:my-0">
                    <div className="bg-gradient-to-r from-blue-600 to-blue-700 text-white h-16 w-16 rounded-full flex items-center justify-center font-bold text-xl relative z-10 shadow-lg">
                      <span>2</span>
                      <div className="absolute -inset-2 rounded-full bg-blue-100 opacity-30 animate-pulse"></div>
                    </div>
                  </div>
                  <div className="lg:w-1/2 lg:pl-12 text-center lg:text-left">
                    <div className="bg-white p-6 rounded-xl shadow-md border border-blue-100 hover:shadow-lg transition-all duration-300">
                      <h3 className="text-xl font-semibold mb-3 text-gray-800">Practice Daily Skills</h3>
                      <p className="text-gray-600">Apply DBT techniques in interactive exercises that simulate real-life emotional challenges and help you respond more effectively.</p>
                    </div>
                  </div>
                </div>
                
                <div className="flex flex-col lg:flex-row items-center" data-aos="fade-up" data-aos-delay="200">
                  <div className="lg:w-1/2 lg:pr-12 text-center lg:text-right order-2 lg:order-1">
                    <div className="bg-white p-6 rounded-xl shadow-md border border-blue-100 hover:shadow-lg transition-all duration-300">
                      <h3 className="text-xl font-semibold mb-3 text-gray-800">Track Your Progress</h3>
                      <p className="text-gray-600">Monitor your emotional growth and skill development through our gamified tracking system that celebrates your achievements.</p>
                    </div>
                  </div>
                  <div className="mx-auto lg:mx-0 my-6 lg:my-0 order-1 lg:order-2">
                    <div className="bg-gradient-to-r from-blue-600 to-blue-700 text-white h-16 w-16 rounded-full flex items-center justify-center font-bold text-xl relative z-10 shadow-lg">
                      <span>3</span>
                      <div className="absolute -inset-2 rounded-full bg-blue-100 opacity-30 animate-pulse"></div>
                    </div>
                  </div>
                  <div className="lg:w-1/2 lg:pl-12 lg:hidden order-3">
                    {/* Mobile duplicate - hidden on desktop */}
                  </div>
                </div>
                
                <div className="flex flex-col lg:flex-row items-center" data-aos="fade-up" data-aos-delay="300">
                  <div className="lg:w-1/2 lg:pr-12 hidden lg:block">
                    {/* Desktop duplicate - hidden on mobile */}
                  </div>
                  <div className="mx-auto lg:mx-0 my-6 lg:my-0">
                    <div className="bg-gradient-to-r from-blue-600 to-blue-700 text-white h-16 w-16 rounded-full flex items-center justify-center font-bold text-xl relative z-10 shadow-lg">
                      <span>4</span>
                      <div className="absolute -inset-2 rounded-full bg-blue-100 opacity-30 animate-pulse"></div>
                    </div>
                  </div>
                  <div className="lg:w-1/2 lg:pl-12 text-center lg:text-left">
                    <div className="bg-white p-6 rounded-xl shadow-md border border-blue-100 hover:shadow-lg transition-all duration-300">
                      <h3 className="text-xl font-semibold mb-3 text-gray-800">Build Lasting Resilience</h3>
                      <p className="text-gray-600">Integrate DBT skills into your daily life to build emotional resilience, improve relationships, and create a life worth living.</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Benefits Section - Enhanced */}
      <section className="py-24 bg-white relative overflow-hidden">
        {/* Background subtle waves */}
        <div className="absolute inset-0 opacity-5">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1440 320" className="absolute w-full min-w-full" style={{ top: '50%', transform: 'translateY(-50%)' }}>
            <path fill="#3B82F6" fillOpacity="1" d="M0,160L48,144C96,128,192,96,288,112C384,128,480,192,576,202.7C672,213,768,171,864,170.7C960,171,1056,213,1152,218.7C1248,224,1344,192,1392,176L1440,160L1440,320L1392,320C1344,320,1248,320,1152,320C1056,320,960,320,864,320C768,320,672,320,576,320C480,320,384,320,288,320C192,320,96,320,48,320L0,320Z"></path>
          </svg>
        </div>
        
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="text-center max-w-3xl mx-auto mb-16" data-aos="fade-up">
            <span className="inline-block py-1 px-3 rounded-full bg-blue-100 text-blue-700 text-sm font-semibold mb-3 tracking-wide">
              TRANSFORMATIVE BENEFITS
            </span>
            <h2 className="text-3xl sm:text-4xl font-bold mb-6 text-gray-800">How DBT Helps</h2>
            <p className="text-gray-600 text-lg">
              Dialectical Behavior Therapy provides practical skills that can transform your relationship with emotions and others.
            </p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-10 max-w-5xl mx-auto">
            <div className="bg-gradient-to-br from-blue-50 to-white p-8 rounded-xl shadow-lg border border-blue-100 relative transform transition-all duration-300 hover:-translate-y-2 hover:shadow-xl" data-aos="fade-up" data-aos-delay="100">
              <div className="absolute -top-6 left-1/2 transform -translate-x-1/2 bg-gradient-to-r from-blue-500 to-blue-600 w-12 h-12 rounded-full flex items-center justify-center shadow-md">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold mb-4 text-gray-800 text-center pt-6">Reduce Emotional Suffering</h3>
              <p className="text-gray-600 text-center">
                Learn to identify, understand, and manage intense emotions that may lead to impulsive actions, creating more stability in your daily life.
              </p>
            </div>
            
            <div className="bg-gradient-to-br from-blue-50 to-white p-8 rounded-xl shadow-lg border border-blue-100 relative transform transition-all duration-300 hover:-translate-y-2 hover:shadow-xl" data-aos="fade-up" data-aos-delay="200">
              <div className="absolute -top-6 left-1/2 transform -translate-x-1/2 bg-gradient-to-r from-blue-500 to-blue-600 w-12 h-12 rounded-full flex items-center justify-center shadow-md">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold mb-4 text-gray-800 text-center pt-6">Improve Relationships</h3>
              <p className="text-gray-600 text-center">
                Develop skills to navigate interpersonal conflicts, set healthy boundaries, and communicate effectively with the important people in your life.
              </p>
            </div>
            
            <div className="bg-gradient-to-br from-blue-50 to-white p-8 rounded-xl shadow-lg border border-blue-100 relative transform transition-all duration-300 hover:-translate-y-2 hover:shadow-xl" data-aos="fade-up" data-aos-delay="300">
              <div className="absolute -top-6 left-1/2 transform -translate-x-1/2 bg-gradient-to-r from-blue-500 to-blue-600 w-12 h-12 rounded-full flex items-center justify-center shadow-md">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold mb-4 text-gray-800 text-center pt-6">Build Life Worth Living</h3>
              <p className="text-gray-600 text-center">
                Create a balanced, meaningful life through mindfulness, acceptance, and positive change strategies that align with your deepest values.
              </p>
            </div>
          </div>
          
          <div className="mt-16 text-center" data-aos="fade-up" data-aos-delay="400">
            <p className="text-blue-700 font-medium mb-4">Research-backed therapeutic approach</p>
            <p className="text-gray-600 max-w-3xl mx-auto">
              DBT has been proven effective for people experiencing a wide range of emotional challenges, including mood disorders, anxiety, interpersonal difficulties, and impulsive behaviors.
            </p>
          </div>
        </div>
      </section>

      {/* CTA Section - Enhanced */}
      <section className="py-24 relative bg-blue-700 text-white overflow-hidden">
        {/* Background light rays */}
        <div className="absolute inset-0">
          <div className="absolute inset-0 bg-gradient-to-r from-blue-600 to-blue-800"></div>
          <div className="absolute inset-0 opacity-30" style={{ 
            background: 'radial-gradient(circle at center, rgba(255,255,255,0.2) 0%, transparent 70%)', 
            backgroundSize: '200% 200%',
            backgroundPosition: 'center center'
          }}></div>
        </div>
        
        {/* Decorative circles */}
        <div className="absolute top-0 left-0 transform translate-x-1/4 -translate-y-1/2">
          <div className="w-64 h-64 rounded-full bg-white opacity-5"></div>
        </div>
        <div className="absolute bottom-0 right-0 transform -translate-x-1/3 translate-y-1/4">
          <div className="w-80 h-80 rounded-full bg-white opacity-5"></div>
        </div>
        
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="max-w-4xl mx-auto">
            <div className="text-center" data-aos="fade-up">
              <span className="inline-block py-1 px-3 rounded-full bg-white bg-opacity-20 text-white text-sm font-semibold mb-6 tracking-wide uppercase">
                Begin Today
              </span>
              <h2 className="text-4xl sm:text-5xl font-bold mb-8 leading-tight">Ready to Transform Your Life?</h2>
              <p className="text-xl md:text-2xl mb-10 max-w-3xl mx-auto text-blue-100">
                Join thousands of people who are developing emotional resilience and building fulfilling lives through our engaging DBT platform.
              </p>
              
              <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                <Link
                  to="/register"
                  className="group relative overflow-hidden rounded-lg bg-white px-8 py-4 text-lg font-bold text-blue-700 shadow-lg transition-all duration-300 ease-out hover:scale-105 hover:shadow-xl"
                >
                  <span className="relative z-10">Begin Your Healing Journey</span>
                  <div className="absolute inset-0 -translate-x-full bg-gradient-to-r from-blue-50 to-white transition-transform duration-300 ease-out group-hover:translate-x-0"></div>
                </Link>
                
                <Link
                  to="/login"
                  className="px-8 py-4 text-lg font-bold text-white underline underline-offset-4 transition-all duration-300 hover:text-blue-200"
                >
                  Sign In to Continue
                </Link>
              </div>
              
              <p className="mt-8 text-blue-200 text-sm">
                Start with a free account. No credit card required.
              </p>
            </div>
          </div>
        </div>
      </section>
      {/* Enhanced Footer */}
      <footer className="bg-blue-800 text-white pt-16 pb-8 relative overflow-hidden">
        {/* Background pattern */}
        <div className="absolute inset-0 opacity-5">
          <div className="absolute inset-0" style={{ 
            backgroundImage: 'radial-gradient(circle at 25px 25px, white 2%, transparent 0%), radial-gradient(circle at 75px 75px, white 2%, transparent 0%)',
            backgroundSize: '100px 100px'
          }}></div>
        </div>
        
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          {/* Footer content grid */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-16">
            {/* Company info */}
            <div className="md:col-span-1">
              <div className="mb-4">
                <span className="text-xl font-bold flex items-center">
                  DBT Journey
                  <span className="ml-2 text-xs bg-white text-blue-700 px-2 py-1 rounded-full">Therapeutic Skills</span>
                </span>
              </div>
              <p className="text-blue-200 mb-6 text-sm">
                Building Skills for a Life Worth Living through evidence-based therapy techniques.
              </p>
              <div className="flex space-x-4">
                <a href="#" className="text-white hover:text-blue-200 transition-colors">
                  <span className="sr-only">Facebook</span>
                  <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                    <path fillRule="evenodd" d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z" clipRule="evenodd" />
                  </svg>
                </a>
                <a href="#" className="text-white hover:text-blue-200 transition-colors">
                  <span className="sr-only">Twitter</span>
                  <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                    <path d="M8.29 20.251c7.547 0 11.675-6.253 11.675-11.675 0-.178 0-.355-.012-.53A8.348 8.348 0 0022 5.92a8.19 8.19 0 01-2.357.646 4.118 4.118 0 001.804-2.27 8.224 8.224 0 01-2.605.996 4.107 4.107 0 00-6.993 3.743 11.65 11.65 0 01-8.457-4.287 4.106 4.106 0 001.27 5.477A4.072 4.072 0 012.8 9.713v.052a4.105 4.105 0 003.292 4.022 4.095 4.095 0 01-1.853.07 4.108 4.108 0 003.834 2.85A8.233 8.233 0 012 18.407a11.616 11.616 0 006.29 1.84" />
                  </svg>
                </a>
                <a href="#" className="text-white hover:text-blue-200 transition-colors">
                  <span className="sr-only">Instagram</span>
                  <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                    <path fillRule="evenodd" d="M12.315 2c2.43 0 2.784.013 3.808.06 1.064.049 1.791.218 2.427.465a4.902 4.902 0 011.772 1.153 4.902 4.902 0 011.153 1.772c.247.636.416 1.363.465 2.427.048 1.067.06 1.407.06 4.123v.08c0 2.643-.012 2.987-.06 4.043-.049 1.064-.218 1.791-.465 2.427a4.902 4.902 0 01-1.153 1.772 4.902 4.902 0 01-1.772 1.153c-.636.247-1.363.416-2.427.465-1.067.048-1.407.06-4.123.06h-.08c-2.643 0-2.987-.012-4.043-.06-1.064-.049-1.791-.218-2.427-.465a4.902 4.902 0 01-1.772-1.153 4.902 4.902 0 01-1.153-1.772c-.247-.636-.416-1.363-.465-2.427-.047-1.024-.06-1.379-.06-3.808v-.63c0-2.43.013-2.784.06-3.808.049-1.064.218-1.791.465-2.427a4.902 4.902 0 011.153-1.772A4.902 4.902 0 015.45 2.525c.636-.247 1.363-.416 2.427-.465C8.901 2.013 9.256 2 11.685 2h.63zm-.081 1.802h-.468c-2.456 0-2.784.011-3.807.058-.975.045-1.504.207-1.857.344-.467.182-.8.398-1.15.748-.35.35-.566.683-.748 1.15-.137.353-.3.882-.344 1.857-.047 1.023-.058 1.351-.058 3.807v.468c0 2.456.011 2.784.058 3.807.045.975.207 1.504.344 1.857.182.466.399.8.748 1.15.35.35.683.566 1.15.748.353.137.882.3 1.857.344 1.054.048 1.37.058 4.041.058h.08c2.597 0 2.917-.01 3.96-.058.976-.045 1.505-.207 1.858-.344.466-.182.8-.398 1.15-.748.35-.35.566-.683.748-1.15.137-.353.3-.882.344-1.857.048-1.055.058-1.37.058-4.041v-.08c0-2.597-.01-2.917-.058-3.96-.045-.976-.207-1.505-.344-1.858a3.097 3.097 0 00-.748-1.15 3.098 3.098 0 00-1.15-.748c-.353-.137-.882-.3-1.857-.344-1.023-.047-1.351-.058-3.807-.058zM12 6.865a5.135 5.135 0 110 10.27 5.135 5.135 0 010-10.27zm0 1.802a3.333 3.333 0 100 6.666 3.333 3.333 0 000-6.666zm5.338-3.205a1.2 1.2 0 110 2.4 1.2 1.2 0 010-2.4z" clipRule="evenodd" />
                  </svg>
                </a>
              </div>
            </div>
            
            {/* Quick links */}
            <div>
              <h3 className="text-lg font-semibold mb-4">Quick Links</h3>
              <ul className="space-y-3">
                <li><Link to="/register" className="text-blue-200 hover:text-white transition-colors">Get Started</Link></li>
                <li><Link to="/login" className="text-blue-200 hover:text-white transition-colors">Login</Link></li>
                <li><a href="#" className="text-blue-200 hover:text-white transition-colors">About DBT</a></li>
                <li><a href="#" className="text-blue-200 hover:text-white transition-colors">Resources</a></li>
              </ul>
            </div>
            
            {/* DBT Resources */}
            <div>
              <h3 className="text-lg font-semibold mb-4">DBT Resources</h3>
              <ul className="space-y-3">
                <li><a href="#" className="text-blue-200 hover:text-white transition-colors">Mindfulness Techniques</a></li>
                <li><a href="#" className="text-blue-200 hover:text-white transition-colors">Distress Tolerance</a></li>
                <li><a href="#" className="text-blue-200 hover:text-white transition-colors">Emotion Regulation</a></li>
                <li><a href="#" className="text-blue-200 hover:text-white transition-colors">Interpersonal Skills</a></li>
              </ul>
            </div>
            
            {/* Contact */}
            <div>
              <h3 className="text-lg font-semibold mb-4">Contact</h3>
              <p className="text-blue-200 mb-4">Have questions about our platform?</p>
              <a href="#" className="inline-block bg-white text-blue-700 font-medium px-4 py-2 rounded hover:bg-blue-50 transition-colors">
                Contact Support
              </a>
            </div>
          </div>
          
          {/* Bottom bar */}
          <div className="border-t border-blue-700 pt-8 flex flex-col md:flex-row justify-between items-center">
            <p className="text-sm text-blue-200 mb-4 md:mb-0">
              DBT Journey - Building Skills for a Life Worth Living. © {new Date().getFullYear()}
            </p>
            <div className="flex space-x-6">
              <a href="#" className="text-sm text-blue-200 hover:text-white transition-colors">Privacy Policy</a>
              <a href="#" className="text-sm text-blue-200 hover:text-white transition-colors">Terms of Service</a>
              <a href="#" className="text-sm text-blue-200 hover:text-white transition-colors">Accessibility</a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;
