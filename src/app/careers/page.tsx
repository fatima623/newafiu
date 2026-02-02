'use client';

import { useEffect, useState, useRef } from 'react';
import { Briefcase, Download, X, ArrowRight } from 'lucide-react';

interface CareersForm {
  id?: number;
  code: string;
  title: string;
  fileUrl: string;
  originalName?: string;
}

interface CareersJob {
  id: number;
  code: string;
  title: string;
  department: string;
  type: string;
  location: string | null;
  description: string | null;
  requirements: string | null;
  responsibilities: string | null;
  applyBy: string | null;
  hiringStartsAt: string | null;
  applyLink: string | null;
  isPublished: boolean;
  createdAt: string;
}

export default function CareersPage() {
  const [forms, setForms] = useState<CareersForm[]>([]);
  const [jobs, setJobs] = useState<CareersJob[]>([]);
  const [showOpeningsPopup, setShowOpeningsPopup] = useState(false);
  const [expandedJobId, setExpandedJobId] = useState<number | null>(null);
  const jobRefs = useRef<{ [key: number]: HTMLDivElement | null }>({});

  useEffect(() => {
    const load = async () => {
      try {
        const res = await fetch('/api/careers-forms');
        const data = await res.json();
        setForms(Array.isArray(data) ? (data as CareersForm[]) : []);
      } catch {
        setForms([
          {
            code: 'job_application',
            title: 'AFIU Job Application Forms',
            fileUrl: '/AFIU%20job%20Application%20Forms.docx',
          },
          {
            code: 'residency_training',
            title: 'APPLICATION FORM FOR RESIDENCY TRAINING AT AFIU',
            fileUrl: '/APPLICATION%20FORM%20FOR%20RESIDENCY%20TRAINING%20AT%20AFIU.docx',
          },
        ]);
      }

      try {
        const res = await fetch('/api/careers-jobs');
        const data = await res.json();
        const list = Array.isArray(data) ? (data as CareersJob[]) : [];
        setJobs(list);
        
        // Show popup automatically if there are job openings
        if (list.length > 0) {
          setShowOpeningsPopup(true);
        }
      } catch {
        setJobs([]);
      }
    };

    load();
  }, []);

  // Handle clicking on a job in the popup - scroll to that job section
  const handleJobClick = (jobId: number) => {
    setShowOpeningsPopup(false);
    setExpandedJobId(jobId);
    
    // Smooth scroll to the job after popup closes
    setTimeout(() => {
      const jobElement = jobRefs.current[jobId];
      if (jobElement) {
        jobElement.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
    }, 100);
  };

  return (
    <div>
      <section className="bg-gradient-to-b from-[#051238] to-[#2A7B9B] text-white py-10">
        <div className="container mx-auto px-4">
          <h1 className="text-4xl font-bold mb-4">Careers</h1>
          <p className="text-lg text-white">Join Our Team of Healthcare Professionals</p>
        </div>
      </section>

      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
              <div>
                <div className="mb-12">
                  <Briefcase size={48} className="text-blue-950 mb-4" />
                  <h2 className="text-3xl font-bold text-gray-800 mb-4">Why Work at AFIU?</h2>
                  <p className="text-gray-600 mb-6">
                    AFIU offers a dynamic and rewarding work environment where you can grow professionally while making a difference in patients' lives.
                  </p>
                  
                  <ul className="space-y-3 text-gray-600">
                    <li>• Competitive salary and benefits</li>
                    <li>• Professional development opportunities</li>
                    <li>• State-of-the-art facilities</li>
                    <li>• Collaborative work environment</li>
                    <li>• Work-life balance</li>
                  </ul>
                </div>

                <div>
                  <h3 className="text-2xl font-bold text-gray-800 mb-4">Current Openings</h3>
                  <div className="space-y-4">
                    {jobs.length === 0 ? (
                      <div className="bg-[#ADD8E6] p-4 rounded-lg">
                        <h4 className="font-bold text-gray-800">No openings right now</h4>
                        <p className="text-sm text-gray-600">Please check back later.</p>
                      </div>
                    ) : (
                      jobs.map((job) => (
                        <div 
                          key={job.id} 
                          className="bg-[#ADD8E6] p-4 rounded-lg"
                          id={`job-${job.id}`}
                          ref={(el) => { jobRefs.current[job.id] = el; }}
                        >
                          <h4 className="font-bold text-gray-800">{job.title}</h4>
                          <p className="text-sm text-gray-600">
                            {job.department} • {job.type}
                            {job.location ? ` • ${job.location}` : ''}
                          </p>
                          {job.applyBy ? (
                            <p className="text-xs text-gray-600 mt-1">Apply by: {new Date(job.applyBy).toLocaleDateString()}</p>
                          ) : null}

                          {job.hiringStartsAt ? (
                            <p className="text-xs text-gray-600 mt-1">
                              Hiring starts: {new Date(job.hiringStartsAt).toLocaleDateString()}
                            </p>
                          ) : null}

                          <div className="mt-3 flex flex-wrap items-center gap-3">
                            <button
                              type="button"
                              onClick={() =>
                                setExpandedJobId((prev) => (prev === job.id ? null : job.id))
                              }
                              className="text-sm font-semibold text-blue-950 hover:underline"
                            >
                              {expandedJobId === job.id ? 'Hide details' : 'View details'}
                            </button>

                            {job.applyLink ? (
                              <a
                                href={job.applyLink}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-sm font-semibold text-white bg-blue-950 hover:bg-blue-700 px-3 py-1.5 rounded-lg transition-colors"
                              >
                                Apply Now
                              </a>
                            ) : null}
                          </div>

                          {expandedJobId === job.id ? (
                            <div className="mt-3 space-y-3">
                              {job.description ? (
                                <div>
                                  <p className="text-sm font-semibold text-gray-800">Description</p>
                                  <p className="text-sm text-gray-700 whitespace-pre-line">{job.description}</p>
                                </div>
                              ) : null}

                              {job.requirements ? (
                                <div>
                                  <p className="text-sm font-semibold text-gray-800">Requirements</p>
                                  <p className="text-sm text-gray-700 whitespace-pre-line">{job.requirements}</p>
                                </div>
                              ) : null}

                              {job.responsibilities ? (
                                <div>
                                  <p className="text-sm font-semibold text-gray-800">Responsibilities</p>
                                  <p className="text-sm text-gray-700 whitespace-pre-line">{job.responsibilities}</p>
                                </div>
                              ) : null}

                              {!job.applyLink ? (
                                <p className="text-xs text-gray-600">
                                  Apply via AFIU HR / application form. (No apply link provided.)
                                </p>
                              ) : null}
                            </div>
                          ) : null}
                        </div>
                      ))
                    )}
                  </div>
                </div>
              </div>

              <div>
                <h2 className="text-3xl font-bold text-gray-800 mb-6">Application Forms</h2>
                <p className="text-gray-600 mb-6">
                  Please download and complete the relevant application form. Once filled, submit it as per the instructions
                  provided on the form or by contacting our careers department.
                </p>
                <div className="space-y-4">
                  {forms.map((form, index) => (
                    <a
                      key={form.code}
                      href={form.fileUrl}
                      download
                      className={
                        index === 0
                          ? 'w-full inline-flex items-center justify-center gap-2 bg-blue-950 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-semibold transition-colors'
                          : 'w-full inline-flex items-center justify-center gap-2 bg-white border border-blue-950 text-blue-950 hover:bg-blue-50 px-6 py-3 rounded-lg font-semibold transition-colors'
                      }
                    >
                      <Download size={20} />
                      {form.title}
                    </a>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Current Openings Popup Modal */}
      {showOpeningsPopup && jobs.length > 0 && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-2xl max-w-lg w-full max-h-[80vh] overflow-hidden animate-in fade-in zoom-in duration-200">
            {/* Modal Header */}
            <div className="bg-gradient-to-r from-blue-950 to-blue-800 px-6 py-4 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-white/20 rounded-xl flex items-center justify-center">
                  <Briefcase size={20} className="text-white" />
                </div>
                <div>
                  <h2 className="text-xl font-bold text-white">Current Openings</h2>
                  <p className="text-blue-100 text-sm">{jobs.length} position{jobs.length > 1 ? 's' : ''} available</p>
                </div>
              </div>
              <button
                onClick={() => setShowOpeningsPopup(false)}
                className="p-2 hover:bg-white/20 rounded-lg transition-colors"
                aria-label="Close popup"
              >
                <X size={24} className="text-white" />
              </button>
            </div>
            
            {/* Modal Body - Job List */}
            <div className="p-4 overflow-y-auto max-h-[60vh]">
              <div className="space-y-3">
                {jobs.map((job) => (
                  <button
                    key={job.id}
                    onClick={() => handleJobClick(job.id)}
                    className="w-full text-left p-4 bg-gray-50 hover:bg-blue-50 border border-gray-200 hover:border-blue-300 rounded-xl transition-all group"
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex-1">
                        <h3 className="font-semibold text-gray-900 group-hover:text-blue-950 transition-colors">
                          {job.title}
                        </h3>
                        <div className="flex flex-wrap items-center gap-2 mt-1">
                          <span className="text-sm text-gray-600">{job.department}</span>
                          <span className="text-gray-300">•</span>
                          <span className="text-xs px-2 py-0.5 bg-blue-100 text-blue-700 rounded-full">{job.type}</span>
                          {job.location && (
                            <>
                              <span className="text-gray-300">•</span>
                              <span className="text-sm text-gray-500">{job.location}</span>
                            </>
                          )}
                        </div>
                        {job.applyBy && (
                          <p className="text-xs text-gray-500 mt-2">
                            Apply by: {new Date(job.applyBy).toLocaleDateString()}
                          </p>
                        )}
                      </div>
                      <ArrowRight size={18} className="text-gray-400 group-hover:text-blue-600 transition-colors mt-1" />
                    </div>
                  </button>
                ))}
              </div>
            </div>
            
            {/* Modal Footer */}
            <div className="px-6 py-4 bg-gray-50 border-t border-gray-200">
              <p className="text-sm text-gray-600 text-center">
                Click on a position to view details and apply
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
