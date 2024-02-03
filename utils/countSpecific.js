function countSpecificJobs(records) {
  const providers = records.filter(
    (record) => record.role === "jobProvider" && record.availability === true
  );
  const seekers = records.filter(
    (record) => record.role === "jobSeeker" && record.availability === true
  );
  const countSpecificJob = (counts, record) => {
    const specificJob = record.specificJob;
    counts[specificJob] = (counts[specificJob] || 0) + 1;
    return counts;
  };

  const providerSpecificJobCounts = providers.reduce(countSpecificJob, {});
  const seekerSpecificJobCounts = seekers.reduce(countSpecificJob, {});

  const totalSeekerSpecificJobCounts = Object.values(
    seekerSpecificJobCounts
  ).reduce((total, count) => total + count, 0);
  const totalProviderSpecificJobCounts = Object.values(
    providerSpecificJobCounts
  ).reduce((total, count) => total + count, 0);

  providerSpecificJobCounts.totalCount = totalProviderSpecificJobCounts;
  seekerSpecificJobCounts.totalCount = totalSeekerSpecificJobCounts;

  return { providerSpecificJobCounts, seekerSpecificJobCounts };
}

module.exports = { countSpecificJobs };
