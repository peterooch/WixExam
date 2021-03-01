import React from 'react';
import './App.scss';

export type ContentState = {
    collapsed: boolean,
    btnNeeded: boolean
}

export class TicketContent extends React.Component<{}, ContentState> {
    
    state: ContentState = {
        collapsed: true,
        btnNeeded: false
    }

    componentDidMount = () =>{
        let btnNeeded = (this.props.children as string).split("\n").length > 3;
        this.setState({btnNeeded: btnNeeded});
    }

    onChange() {
        this.setState({collapsed: !this.state.collapsed})
    }
    getContent() {
        if (!this.state.collapsed)
            return this.props.children;

        let content = this.props.children as string;
        
        return content.split('\n').slice(0, 3).join('\n');
    }
    render() {
        return (<div className='content'>
                    <p>
                        {this.state.btnNeeded ? this.getContent() : this.props.children}
                    </p>
                        {this.state.btnNeeded ? 
                        <button className='btn btn-secondary btn-sm' onClick={(e) => this.onChange()}>
                        {this.state.collapsed ? 'Show More' : 'Show Less'}
                        </button>
                        : null
                        }
                </div>);
    }
}
