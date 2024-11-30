// import React, { ReactNode, Component } from 'react';

// interface ErrorBoundaryProps {
//   children: ReactNode;
//   onError: (error: Error, errorInfo: React.ErrorInfo) => void;
// }

// interface ErrorBoundaryState {
//   hasError: boolean;
//   error: Error | null;
//   errorInfo: React.ErrorInfo | null;
// }

// class ErrorBoundaryClass extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
//   constructor(props: ErrorBoundaryProps) {
//     super(props);
//     this.state = { hasError: false, error: null, errorInfo: null };
//   }


//   componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
//     this.setState({ hasError: true, error, errorInfo });
//     this.props.onError(error, errorInfo);
//   }

//   render() {
//     if (this.state.hasError) {
//       // Render a fallback UI
//       return <div>Something went wrong.</div>;
//     }

//     return this.props.children;
//   }
// }

// const ErrorBoundary: React.FC<ErrorBoundaryProps> = (props) => {
//   return <ErrorBoundaryClass {...props} />;
// };

// export default ErrorBoundary;