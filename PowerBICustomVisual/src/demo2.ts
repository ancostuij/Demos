/*
 * 
 * Copyright (c) 2016 Jan Pieter Posthuma
 * 
 * All rights reserved.
 * 
 * MIT License.
 * 
 * Permission is hereby granted, free of charge, to any person obtaining a copy
 *  of this software and associated documentation files (the "Software"), to deal
 *  in the Software without restriction, including without limitation the rights
 *  to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 *  copies of the Software, and to permit persons to whom the Software is
 *  furnished to do so, subject to the following conditions:
 * 
 * The above copyright notice and this permission notice shall be included in
 *  all copies or substantial portions of the Software.
 * 
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 *  IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 *  FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 *  AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 *  LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 *  OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
 *  THE SOFTWARE.
 *
 */

/*
 * Demo 2:
 *     - Defining DataView structure
 *     - Converting DataView to readable visual data
 *     - Use readable visual data for visualization
 */

module powerbi.extensibility.visual {
    // Single visual dataPoint
    export interface VisualDataPoint {
        category: string;
        value: number;
    }

    // Collection of visual dataPoint. Length === # categories 
    export interface VisualDataPoints {
        dataPoints: VisualDataPoint[]
    }

    export class Visual implements IVisual {
        private target: HTMLElement;
        private updateCount: number;

        private convertor(dataView: DataView) : VisualDataPoints {
            // Check if given dataView is not empty
            if (!dataView ||
                !dataView.categorical ||
                !dataView.categorical.categories ||
                !dataView.categorical.categories[0].source) {
                return {
                    dataPoints: []
                }
            }

            let dataPoints: VisualDataPoint[] = [];
            let categories = dataView.categorical.categories[0].values;
            let values = dataView.categorical.values[0].values;

            // Loop thru category values
            for (let i = 0; i < categories.length; i++) {
                // Get category and value
                let category = categories[i];
                let value = values[i];

                // Create dataPoint and push it into the dataPoints array
                dataPoints.push({
                    category: category,
                    value: value
                })
            }

            // Return dataPoints array
            return {
                dataPoints: dataPoints
            }
        }

        constructor(options: VisualConstructorOptions) {
            console.log('Visual constructor', options);
            this.target = options.element;
            this.updateCount = 0;
        }

        public update(options: VisualUpdateOptions) {
            console.log('Visual update', options);

            // Clear old information
            this.target.innerHTML = "";
            
            // Convert dataView object to usable dataPoints
            let visualDataPoints = this.convertor(options.dataViews[0]);
            let dataPoints = visualDataPoints.dataPoints;

            // Loop thru dataPoints and print content (category and value) 
            for (let i = 0; i < dataPoints.length; i++) {
                this.target.innerHTML += `<p>DataPoint: category: <em>${(dataPoints[i].category)}</em> and value <em>${(dataPoints[i].value)}</em></p>`;
            }
        }

        public destroy(): void {
            //TODO: Perform any cleanup tasks here
        }
    }
}