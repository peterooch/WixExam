import React from 'react';

export interface IPageButtonProps {
	pageNum: number,
	current: number,
	callback: (page: number) => void,
	content?: string,
}

/* Simple component for pagination buttons */
export class PageButton extends React.Component<IPageButtonProps, {}> {
	render() {
		return (<li className={`page-item ${(this.props.current === this.props.pageNum) ? "active" : ""}`}>
					<button className="page-link"
							onClick={() => this.props.callback(this.props.pageNum)}>
						{this.props.content ? this.props.content : this.props.pageNum}
					</button>
				</li>);
	}
}
