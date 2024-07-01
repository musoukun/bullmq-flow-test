import React, { Component, ErrorInfo, ReactNode } from "react";

interface ErrorBoundaryProps {
	children: ReactNode;
}

interface ErrorBoundaryState {
	hasError: boolean;
	error: Error | null;
}

class ErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
	constructor(props: ErrorBoundaryProps) {
		super(props);
		this.state = { hasError: false, error: null };
	}

	static getDerivedStateFromError(error: Error): ErrorBoundaryState {
		return { hasError: true, error };
	}

	componentDidCatch(error: Error, errorInfo: ErrorInfo) {
		console.error("Error caught by ErrorBoundary:", error, errorInfo);
	}

	render() {
		if (this.state.hasError) {
			return (
				<div className="error-boundary p-4 bg-red-100 border border-red-400 text-red-700 rounded">
					<h2 className="text-lg font-bold mb-2">
						Something went wrong
					</h2>
					<p>{this.state.error?.message}</p>
				</div>
			);
		}

		return this.props.children;
	}
}

export default ErrorBoundary;
