/** @type {import('next').NextConfig} */
module.exports = {
	reactStrictMode: true,
	transpilePackages: ["@repo/ui"],
	experimental: {
		externalDir: true,
	},
};
