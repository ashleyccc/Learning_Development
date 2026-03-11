// User Interface and State Management

// Content Database for Quests
const QUEST_DATA = {
    "piggy-bank": {
        title: "The Piggy Bank Myth",
        icon: "fa-piggy-bank",
        color: "var(--success)",
        content: `
            <p>You've probably been told your whole life: <strong>"Save your money in a piggy bank or a savings account."</strong></p>
            <p>While having cash on hand for emergencies is crucial, keeping <em>all</em> your money in cash is actually a surefire way to lose wealth over time. Why? A hidden monster called <strong>Inflation</strong>.</p>
            <h4>The Invisible Tax</h4>
            <p>Inflation means the cost of things goes up every year. A movie ticket used to cost $5. Now it's $15. If your money is just sitting in a piggy bank earning 0% interest, its "purchasing power" is actually shrinking every single day.</p>
            <ul>
                <li>Average Inflation Rate: ~3% per year</li>
                <li>Average Bank Account Interest: ~0.5% per year</li>
                <li><strong>Result: You are losing 2.5% of your money's value annually!</strong></li>
            </ul>
            <p>To really grow wealth, your money needs to work for you by growing <em>faster</em> than inflation. That's why the rich invest.</p>
        `
    },
    "snowball": {
        title: "The Snowball Effect",
        icon: "fa-snowflake",
        color: "var(--accent)",
        content: `
            <p>Imagine packing a small snowball and rolling it down a very long, snowy hill. As it rolls, it picks up more snow. The bigger it gets, the <em>faster</em> it picks up even more snow.</p>
            <p>In finance, this is called <strong>Compound Interest</strong>. It is the single most powerful force in investing.</p>
            <h4>Earning Interest on Interest</h4>
            <p>When you invest money (your principal), it earns money (interest or returns). In year two, you earn returns not just on your original money, but on the returns from year one, too!</p>
            <p>Let's say you invest $1,000 at a 10% return.</p>
            <ul>
                <li>Year 1: $1,000 + $100 = $1,100</li>
                <li>Year 2: $1,100 + $110 = $1,210</li>
                <li>Year 3: $1,210 + $121 = $1,331</li>
            </ul>
            <p>Over decades, this curve goes vertical. Time is your biggest advantage as a teenager. Starting with $100/month at age 16 makes you substantially wealthier than someone starting with $500/month at age 35.</p>
        `
    },
    "stocks": {
        title: "Stocks 101",
        icon: "fa-lock",
        color: "var(--text-muted)",
        content: `<p>To unlock this quest, you must reach Level 2 by completing earlier modules!</p>`
    },
     "etfs": {
        title: "ETFs vs Mutual Funds",
        icon: "fa-lock",
        color: "var(--text-muted)",
        content: `<p>To unlock this quest, you must reach Level 3.</p>`
    }
};

const app = {
    init() {
        this.setupNavigation();
        this.setupTools();
        this.setupChat();
    },

    setupTools() {
        const toolBtns = document.querySelectorAll('.tool-card .btn-secondary');
        toolBtns.forEach(btn => {
            btn.addEventListener('click', (e) => {
                e.preventDefault();
                this.openToolModal(e.currentTarget);
            });
        });
        
        // Also ensure window.app exists for any remaining inline handlers
        window.app = this;
    },

    setupNavigation() {
        const navLinks = document.querySelectorAll('.nav-links li');

        navLinks.forEach(link => {
            link.addEventListener('click', (e) => {
                const targetId = e.currentTarget.getAttribute('data-target');
                this.navigateTo(targetId);
            });
        });
    },

    navigateTo(targetId) {
        if (['tools', 'insights', 'professionals'].includes(targetId)) {
            // If we are currently on a different view, switch to 'home' first
            if (!document.getElementById('home').classList.contains('active-view')) {
                this.switchView('home');
            }
            setTimeout(() => {
                const section = document.getElementById(`${targetId}-section`);
                if (section) {
                    section.scrollIntoView({ behavior: 'smooth' });
                }
            }, 50);
        } else {
            // Otherwise, switch full views (e.g., to Roadmap or Mentor)
            this.switchView(targetId);
        }
    },

    switchView(targetId) {
        // Handle nav active states
        document.querySelectorAll('.nav-links li').forEach(l => l.classList.remove('active'));
        const navTarget = document.querySelector(`.nav-links li[data-target="${targetId}"]`);
        if (navTarget) navTarget.classList.add('active');

        // Hide all views and show target
        document.querySelectorAll('.view').forEach(v => v.classList.remove('active-view'));
        const viewEl = document.getElementById(targetId);
        if (viewEl) viewEl.classList.add('active-view');
        
        // Auto-focus chat input if mentor clicked
        if(targetId === 'mentor') {
            setTimeout(() => {
                const input = document.getElementById('userInput');
                if(input) input.focus();
            }, 100);
        }
        
    // Scroll to top when switching views
        window.scrollTo(0, 0);
    },

    openToolModal(btn) {
        const card = btn.closest('.tool-card');
        if (!card) return;
        
        const title = card.querySelector('h4').textContent;
        const desc = card.querySelector('p').textContent;
        const iconHtml = card.querySelector('.tool-icon').innerHTML;
        
        document.getElementById('toolModalTitle').textContent = title;
        document.getElementById('toolModalDesc').textContent = desc;
        document.getElementById('toolModalIcon').innerHTML = iconHtml;
        
        const modalBody = document.getElementById('toolModalBody');
        
        // Custom logic for top tools, otherwise generic "coming soon"
        if (title.includes('Net Worth')) {
            modalBody.innerHTML = `
                <div style="display: flex; flex-direction: column; gap: 16px;">
                    <div>
                        <label style="color: var(--text-muted); font-size: 14px; margin-bottom: 8px; display: block;">Current Savings ($)</label>
                        <input type="number" value="1000" style="width: 100%; padding: 12px; background: rgba(255,255,255,0.05); border: 1px solid var(--border-color); border-radius: var(--radius-sm); color: white;">
                    </div>
                    <div>
                        <label style="color: var(--text-muted); font-size: 14px; margin-bottom: 8px; display: block;">Monthly Contribution ($)</label>
                        <input type="number" value="200" style="width: 100%; padding: 12px; background: rgba(255,255,255,0.05); border: 1px solid var(--border-color); border-radius: var(--radius-sm); color: white;">
                    </div>
                    <button class="btn-primary" style="margin-top: 16px; padding: 12px; border-radius: var(--radius-sm); width: 100%;">Calculate Projection</button>
                    <div style="margin-top: 24px; padding: 24px; background: rgba(16, 185, 129, 0.1); border: 1px solid rgba(16, 185, 129, 0.3); border-radius: var(--radius-sm); text-align: center;">
                        <span style="color: var(--text-muted); font-size: 14px;">Estimated Net Worth in 10 Years</span>
                        <div style="font-size: 32px; font-weight: bold; color: var(--success); margin-top: 8px;">$43,520</div>
                    </div>
                </div>
            `;
        } else if (title.includes('Compound Interest')) {
            modalBody.innerHTML = `
                <div style="display: flex; flex-direction: column; gap: 16px;">
                    <div>
                        <label style="color: var(--text-muted); font-size: 14px; margin-bottom: 8px; display: block;">Initial Investment ($)</label>
                        <input type="number" value="5000" style="width: 100%; padding: 12px; background: rgba(255,255,255,0.05); border: 1px solid var(--border-color); border-radius: var(--radius-sm); color: white;">
                    </div>
                    <div>
                        <label style="color: var(--text-muted); font-size: 14px; margin-bottom: 8px; display: block;">Expected Annual Return (%)</label>
                        <input type="number" value="8" style="width: 100%; padding: 12px; background: rgba(255,255,255,0.05); border: 1px solid var(--border-color); border-radius: var(--radius-sm); color: white;">
                    </div>
                    <button class="btn-primary" style="margin-top: 16px; padding: 12px; border-radius: var(--radius-sm); width: 100%;">Visualize Growth</button>
                    <div style="margin-top: 24px; text-align: center;">
                        <div class="placeholder-chart" style="height: 120px; display: flex; align-items: flex-end; gap: 4px;">
                            <div style="flex: 1; background: rgba(255,255,255,0.1); height: 20%; border-radius: 4px 4px 0 0;"></div>
                            <div style="flex: 1; background: rgba(255,255,255,0.15); height: 35%; border-radius: 4px 4px 0 0;"></div>
                            <div style="flex: 1; background: rgba(255,255,255,0.2); height: 50%; border-radius: 4px 4px 0 0;"></div>
                            <div style="flex: 1; background: rgba(255,255,255,0.3); height: 75%; border-radius: 4px 4px 0 0;"></div>
                            <div style="flex: 1; background: var(--success); height: 100%; border-radius: 4px 4px 0 0; box-shadow: 0 0 10px rgba(16,185,129,0.5);"></div>
                        </div>
                    </div>
                </div>
            `;
        } else if (title.includes('How Rich Are You')) {
            modalBody.innerHTML = `
                <div style="display: flex; flex-direction: column; gap: 16px;">
                    <div>
                        <label style="color: var(--text-muted); font-size: 14px; margin-bottom: 8px; display: block;">Annual Pre-Tax Income ($)</label>
                        <input type="number" value="75000" style="width: 100%; padding: 12px; background: rgba(255,255,255,0.05); border: 1px solid var(--border-color); border-radius: var(--radius-sm); color: white;">
                    </div>
                    <div>
                        <label style="color: var(--text-muted); font-size: 14px; margin-bottom: 8px; display: block;">Total Net Worth ($)</label>
                        <input type="number" value="120000" style="width: 100%; padding: 12px; background: rgba(255,255,255,0.05); border: 1px solid var(--border-color); border-radius: var(--radius-sm); color: white;">
                    </div>
                    <button class="btn-primary" style="margin-top: 16px; padding: 12px; border-radius: var(--radius-sm); width: 100%;">Calculate Percentile</button>
                    <div style="margin-top: 24px; padding: 24px; background: rgba(0, 246, 255, 0.1); border: 1px solid rgba(0, 246, 255, 0.3); border-radius: var(--radius-sm); text-align: center;">
                        <span style="color: var(--text-muted); font-size: 14px;">You are richer than</span>
                        <div style="font-size: 32px; font-weight: bold; color: var(--accent); margin-top: 8px;">68% of Americans</div>
                        <span style="color: var(--text-muted); font-size: 12px; display: block; margin-top: 8px;">Based on household data</span>
                    </div>
                </div>
            `;
        } else if (title.includes('Side Hustle')) {
            modalBody.innerHTML = `
                <div style="display: flex; flex-direction: column; gap: 16px;">
                    <div style="display: flex; gap: 16px;">
                        <div style="flex: 1;">
                            <label style="color: var(--text-muted); font-size: 14px; margin-bottom: 8px; display: block;">Startup Cost ($)</label>
                            <input type="number" value="500" style="width: 100%; padding: 12px; background: rgba(255,255,255,0.05); border: 1px solid var(--border-color); border-radius: var(--radius-sm); color: white;">
                        </div>
                        <div style="flex: 1;">
                            <label style="color: var(--text-muted); font-size: 14px; margin-bottom: 8px; display: block;">Hours/Week</label>
                            <input type="number" value="10" style="width: 100%; padding: 12px; background: rgba(255,255,255,0.05); border: 1px solid var(--border-color); border-radius: var(--radius-sm); color: white;">
                        </div>
                    </div>
                    <div style="display: flex; gap: 16px;">
                        <div style="flex: 1;">
                            <label style="color: var(--text-muted); font-size: 14px; margin-bottom: 8px; display: block;">Monthly Revenue</label>
                            <input type="number" value="800" style="width: 100%; padding: 12px; background: rgba(255,255,255,0.05); border: 1px solid var(--border-color); border-radius: var(--radius-sm); color: white;">
                        </div>
                        <div style="flex: 1;">
                            <label style="color: var(--text-muted); font-size: 14px; margin-bottom: 8px; display: block;">Monthly Costs</label>
                            <input type="number" value="150" style="width: 100%; padding: 12px; background: rgba(255,255,255,0.05); border: 1px solid var(--border-color); border-radius: var(--radius-sm); color: white;">
                        </div>
                    </div>
                    <button class="btn-primary" style="margin-top: 16px; padding: 12px; border-radius: var(--radius-sm); width: 100%;">Calculate True ROI</button>
                    <div style="margin-top: 24px; padding: 20px; border: 1px solid var(--border-color); border-radius: var(--radius-sm); display: flex; justify-content: space-around; text-align: center;">
                        <div>
                            <div style="color: var(--text-muted); font-size: 13px;">True Hourly Wage</div>
                            <div style="font-size: 20px; font-weight: bold; color: var(--success); margin-top: 4px;">$15.00/hr</div>
                        </div>
                        <div>
                            <div style="color: var(--text-muted); font-size: 13px;">Break-Even</div>
                            <div style="font-size: 20px; font-weight: bold; color: var(--warning); margin-top: 4px;">0.8 Months</div>
                        </div>
                    </div>
                </div>
            `;
        } else if (title.includes('Decision Simulator')) {
            modalBody.innerHTML = `
                <div style="display: flex; flex-direction: column; gap: 16px;">
                    <div style="padding: 16px; background: rgba(255,255,255,0.02); border: 1px solid var(--border-color); border-radius: var(--radius-sm);">
                        <h4 style="margin: 0 0 16px 0; font-size: 16px;">Scenario: Rent vs Buy</h4>
                        <div style="display: flex; gap: 16px; margin-bottom: 12px;">
                            <div style="flex: 1;">
                                <label style="color: var(--text-muted); font-size: 13px; display: block;">Monthly Rent</label>
                                <input type="number" value="2000" style="width: 100%; padding: 8px; background: rgba(255,255,255,0.05); border: 1px solid transparent; border-radius: 4px; color: white;">
                            </div>
                            <div style="flex: 1;">
                                <label style="color: var(--text-muted); font-size: 13px; display: block;">Home Price</label>
                                <input type="number" value="400000" style="width: 100%; padding: 8px; background: rgba(255,255,255,0.05); border: 1px solid transparent; border-radius: 4px; color: white;">
                            </div>
                        </div>
                        <button class="btn-secondary" style="width: 100%; padding: 10px; font-size: 14px;">Run Simulation</button>
                    </div>
                    <div style="margin-top: 8px; padding: 20px; border-left: 3px solid var(--primary); background: rgba(59, 130, 246, 0.05);">
                        <div style="font-weight: bold; margin-bottom: 8px;">The Verdict</div>
                        <p style="font-size: 14px; color: var(--text-muted); margin: 0; line-height: 1.5;">At a 7% interest rate, renting and investing the down payment into the S&P 500 yields a <strong>+$64,000</strong> higher net worth over 10 years than buying.</p>
                    </div>
                </div>
            `;
        } else if (title.includes('Portfolio Builder')) {
            modalBody.innerHTML = `
                <div style="display: flex; flex-direction: column; gap: 16px;">
                    <div style="margin-bottom: 8px;">
                        <div style="display: flex; justify-content: space-between; margin-bottom: 8px;">
                            <span style="color: var(--text-main); font-weight: 600;">US Equities (S&P 500)</span>
                            <span style="color: var(--accent);">80%</span>
                        </div>
                        <div style="height: 8px; background: rgba(255,255,255,0.1); border-radius: 4px; overflow: hidden;">
                            <div style="height: 100%; width: 80%; background: var(--accent);"></div>
                        </div>
                    </div>
                    <div style="margin-bottom: 8px;">
                        <div style="display: flex; justify-content: space-between; margin-bottom: 8px;">
                            <span style="color: var(--text-main); font-weight: 600;">International Equities</span>
                            <span style="color: var(--primary);">15%</span>
                        </div>
                        <div style="height: 8px; background: rgba(255,255,255,0.1); border-radius: 4px; overflow: hidden;">
                            <div style="height: 100%; width: 15%; background: var(--primary);"></div>
                        </div>
                    </div>
                    <div style="margin-bottom: 16px;">
                        <div style="display: flex; justify-content: space-between; margin-bottom: 8px;">
                            <span style="color: var(--text-main); font-weight: 600;">Bonds / Fixed Income</span>
                            <span style="color: var(--warning);">5%</span>
                        </div>
                        <div style="height: 8px; background: rgba(255,255,255,0.1); border-radius: 4px; overflow: hidden;">
                            <div style="height: 100%; width: 5%; background: var(--warning);"></div>
                        </div>
                    </div>
                    <div style="padding: 16px; background: rgba(255,255,255,0.02); border: 1px solid var(--border-color); border-radius: var(--radius-sm); text-align: center;">
                        <span style="color: var(--text-muted); font-size: 13px;">Historical Annual Return</span>
                        <div style="font-size: 28px; font-weight: bold; color: var(--success); margin-top: 4px;">9.4%</div>
                        <span style="color: var(--text-muted); font-size: 13px; display: block; margin-top: 8px;">"Aggressive Growth" Allocation</span>
                    </div>
                </div>
            `;
        } else if (title.includes('Salary Map')) {
            modalBody.innerHTML = `
                <div style="display: flex; flex-direction: column; gap: 12px;">
                    <div style="display: flex; justify-content: space-between; padding: 16px; border-bottom: 1px solid rgba(255,255,255,0.05); align-items: center;">
                        <div>
                            <div style="font-weight: bold; color: var(--text-main);">Investment Banking Analyst</div>
                            <div style="font-size: 12px; color: var(--text-muted);">Wall Street (Year 1)</div>
                        </div>
                        <div style="text-align: right;">
                            <div style="font-weight: bold; color: var(--success);">$180,000</div>
                            <div style="font-size: 12px; color: var(--text-muted);">Base + Bonus</div>
                        </div>
                    </div>
                    <div style="display: flex; justify-content: space-between; padding: 16px; border-bottom: 1px solid rgba(255,255,255,0.05); align-items: center;">
                        <div>
                            <div style="font-weight: bold; color: var(--text-main);">Private Equity Associate</div>
                            <div style="font-size: 12px; color: var(--text-muted);">Mega-Fund</div>
                        </div>
                        <div style="text-align: right;">
                            <div style="font-weight: bold; color: var(--success);">$300,000+</div>
                            <div style="font-size: 12px; color: var(--text-muted);">Base + Bonus</div>
                        </div>
                    </div>
                    <div style="display: flex; justify-content: space-between; padding: 16px; align-items: center;">
                        <div>
                            <div style="font-weight: bold; color: var(--text-main);">Financial Planner (CFP)</div>
                            <div style="font-size: 12px; color: var(--text-muted);">Mid-Level</div>
                        </div>
                        <div style="text-align: right;">
                            <div style="font-weight: bold; color: var(--success);">$95,000</div>
                            <div style="font-size: 12px; color: var(--text-muted);">National Average</div>
                        </div>
                    </div>
                </div>
            `;
        } else if (title.includes('Investor Portfolios')) {
            modalBody.innerHTML = `
                <div style="display: flex; flex-direction: column; gap: 16px;">
                    <div style="padding: 20px; background: rgba(255,255,255,0.02); border: 1px solid var(--border-color); border-radius: var(--radius-sm); position: relative; overflow: hidden;">
                        <h3 style="margin: 0 0 4px 0;">Warren Buffett <span style="font-size: 14px; font-weight: normal; color: var(--text-muted);">(Berkshire Hathaway)</span></h3>
                        <p style="font-size: 13px; color: var(--text-muted); margin-bottom: 16px;">Value investing focused on wide moats and strong cash flows.</p>
                        
                        <div style="display: flex; align-items: center; justify-content: space-between; margin-bottom: 8px;">
                            <span><i class="fa-solid fa-apple-whole text-muted" style="margin-right: 8px;"></i> Apple (AAPL)</span>
                            <span style="font-weight: bold;">42.9%</span>
                        </div>
                        <div style="display: flex; align-items: center; justify-content: space-between; margin-bottom: 8px;">
                            <span><i class="fa-solid fa-building-columns text-primary" style="margin-right: 8px;"></i> Bank of America (BAC)</span>
                            <span style="font-weight: bold;">10.2%</span>
                        </div>
                        <div style="display: flex; align-items: center; justify-content: space-between; margin-bottom: 8px;">
                            <span><i class="fa-solid fa-credit-card text-accent" style="margin-right: 8px;"></i> American Express (AXP)</span>
                            <span style="font-weight: bold;">8.6%</span>
                        </div>
                        <div style="display: flex; align-items: center; justify-content: space-between;">
                            <span><i class="fa-solid fa-bottle-water text-warning" style="margin-right: 8px;"></i> Coca-Cola (KO)</span>
                            <span style="font-weight: bold;">6.8%</span>
                        </div>
                    </div>
                </div>
            `;
        } else if (title.includes('Market Events')) {
            modalBody.innerHTML = `
                <div style="display: flex; flex-direction: column; gap: 16px;">
                    <div style="padding: 16px; border-left: 3px solid var(--warning); background: rgba(245, 158, 11, 0.05); margin-bottom: 8px;">
                        <h4 style="color: var(--warning); margin: 0 0 8px 0;">Inflation & Interest Rates</h4>
                        <p style="font-size: 14px; color: var(--text-muted); margin: 0; line-height: 1.5;">When inflation is too high, the Federal Reserve raises interest rates. This makes borrowing money (like mortgages and business loans) more expensive, which slows down spending and chills the economy.</p>
                    </div>
                    <div style="padding: 16px; border-left: 3px solid var(--accent); background: rgba(0, 246, 255, 0.05);">
                        <h4 style="color: var(--accent); margin: 0 0 8px 0;">Bear Markets</h4>
                        <p style="font-size: 14px; color: var(--text-muted); margin: 0; line-height: 1.5;">A "Bear Market" occurs when stock prices drop 20% or more from recent highs. Historically, the stock market always recovers and hits new all-time highs, making bear markets the best time to buy assets on discount.</p>
                    </div>
                </div>
            `;
        } else if (title.includes('Myths Debunked')) {
            modalBody.innerHTML = `
                <div style="display: flex; flex-direction: column; gap: 16px;">
                    <div style="padding: 20px; border: 1px solid rgba(239, 68, 68, 0.3); border-radius: var(--radius-sm); position: relative;">
                        <span style="position: absolute; top: -10px; left: 16px; background: #ef4444; color: white; padding: 2px 8px; font-size: 10px; font-weight: bold; border-radius: 4px; text-transform: uppercase;">Myth</span>
                        <p style="font-style: italic; margin: 0 0 12px 0;">"Renting an apartment is just throwing money away. You need to buy a house ASAP."</p>
                        <hr style="border-color: rgba(255,255,255,0.05); margin: 12px 0;">
                        <h4 style="color: var(--success); margin: 0 0 8px 0; font-size: 14px;"><i class="fa-solid fa-check"></i> The Reality</h4>
                        <p style="font-size: 14px; color: var(--text-muted); margin: 0; line-height: 1.5;">Buying involves unrecoverable costs: property taxes, maintenance (1-2% of home value annually), and mortgage interest. If renting is significantly cheaper, taking the difference and investing it in the S&P 500 often yields a higher Net Worth.</p>
                    </div>
                    
                     <div style="padding: 20px; border: 1px solid rgba(239, 68, 68, 0.3); border-radius: var(--radius-sm); position: relative;">
                        <span style="position: absolute; top: -10px; left: 16px; background: #ef4444; color: white; padding: 2px 8px; font-size: 10px; font-weight: bold; border-radius: 4px; text-transform: uppercase;">Myth</span>
                        <p style="font-style: italic; margin: 0 0 12px 0;">"You need to be rich to start investing in the stock market."</p>
                        <hr style="border-color: rgba(255,255,255,0.05); margin: 12px 0;">
                        <h4 style="color: var(--success); margin: 0 0 8px 0; font-size: 14px;"><i class="fa-solid fa-check"></i> The Reality</h4>
                        <p style="font-size: 14px; color: var(--text-muted); margin: 0; line-height: 1.5;">Thanks to fractional shares and zero-commission brokers like Fidelity or Vanguard, you can begin investing with as little as $1. Time in the market is more important than initial capital.</p>
                    </div>
                </div>
            `;
        } else {
            modalBody.innerHTML = `
                <div style="text-align: center; padding: 40px 0;">
                    <i class="fa-solid fa-person-digging text-muted" style="font-size: 48px; margin-bottom: 20px; opacity: 0.5;"></i>
                    <h3 style="margin-bottom: 12px;">Tool Under Construction</h3>
                    <p style="color: var(--text-muted); line-height: 1.6;">We're currently engineering the data models and calculation engine for the <strong>${title}</strong>. Check back soon for the functional tool.</p>
                </div>
            `;
        }
        
        document.getElementById('toolModal').classList.remove('hidden');
    },

    // Chat UI Logic
    setupChat() {
        const chatForm = document.getElementById('chatForm');
        const userInput = document.getElementById('userInput');
        
        if (!chatForm || !userInput) return;

        chatForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            const text = userInput.value.trim();
            if (!text) return;

            // 1. Add User Message
            this.addMessageToChat(text, 'user');
            userInput.value = '';
            
            // 2. Add loading indicator
            const indicatorId = this.addTypingIndicator();

            try {
                // 3. Call external API functionality (will be connected in api.js)
                // We use global window.askMentor defined in api.js
                if (typeof window.askMentor === 'function') {
                    const responseText = await window.askMentor(text);
                    this.removeElement(indicatorId);
                    this.addMessageToChat(responseText, 'bot');
                } else {
                    throw new Error("API module not loaded.");
                }
            } catch (error) {
                console.error("Chat Error:", error);
                this.removeElement(indicatorId);
                this.addMessageToChat("System Error: Could not reach the Purdue GenAI API. Check your connection or API configuration.", 'system');
            }
        });
    },

    openMentorForArticle(articleTitle) {
        // Switch view to mentor
        this.navigateTo('mentor');
        
        // Give the UI a tiny moment to render the view before interacting with inputs
        setTimeout(() => {
            const userInput = document.getElementById('userInput');
            const chatForm = document.getElementById('chatForm');
            
            if (userInput && chatForm) {
                // Pre-populate the input
                userInput.value = `Can you break down the core concepts from the article: "${articleTitle}"? Explain it like I'm a beginner.`;
                
                // Programmatically submit the form
                chatForm.dispatchEvent(new Event('submit', {
                    'bubbles': true,
                    'cancelable': true
                }));
            }
        }, 150);
    },

    addMessageToChat(text, sender) {
        const history = document.getElementById('chatHistory');
        const div = document.createElement('div');
        div.className = `message ${sender}`;
        
        const bubble = document.createElement('div');
        bubble.className = 'bubble';
        
        // Simple Markdown parsing for bold and line breaks
        let formattedText = text
            .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
            .replace(/\n/g, '<br>');
        
        bubble.innerHTML = formattedText;
        div.appendChild(bubble);
        history.appendChild(div);
        
        this.scrollToBottom();
    },

    addTypingIndicator() {
        const history = document.getElementById('chatHistory');
        const id = 'indicator-' + Date.now();
        
        const div = document.createElement('div');
        div.className = 'message bot';
        div.id = id;
        
        div.innerHTML = `
            <div class="bubble">
                <div class="typing-indicator">
                    <span></span><span></span><span></span>
                </div>
            </div>
        `;
        
        history.appendChild(div);
        this.scrollToBottom();
        return id;
    },

    removeElement(id) {
        const el = document.getElementById(id);
        if (el) el.remove();
    },

    scrollToBottom() {
        const history = document.getElementById('chatHistory');
        history.scrollTop = history.scrollHeight;
    },

    // News UI Logic
    async setupNews() {
        const grid = document.getElementById('newsGrid');
        if (!grid) return;

        try {
            // Using a CORS proxy to fetch raw Yahoo Finance RSS XML
            const rssUrl = encodeURIComponent('https://feeds.finance.yahoo.com/rss/2.0/headline?s=SPY,QQQ,AAPL');
            const response = await fetch(`https://api.allorigins.win/raw?url=${rssUrl}`);
            
            if (!response.ok) throw new Error('Network response was not ok');
            const xmlText = await response.text();
            
            // Parse the RSS string into an XML Document
            const parser = new DOMParser();
            const xmlDoc = parser.parseFromString(xmlText, "text/xml");
            const items = xmlDoc.querySelectorAll("item");
            
            grid.innerHTML = ''; // clear loading state
            
            // Render up to 6 articles
            const count = Math.min(items.length, 6);
            for (let i = 0; i < count; i++) {
                const item = items[i];
                const title = item.querySelector("title")?.textContent || "Market Update";
                const link = item.querySelector("link")?.textContent || "#";
                const pubDate = item.querySelector("pubDate")?.textContent || "";
                
                // Format date nicely
                const dateObj = new Date(pubDate);
                const dateStr = isNaN(dateObj) ? pubDate : dateObj.toLocaleDateString() + ' ' + dateObj.toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'});

                const cardStyle = `
                    <div class="glass-card news-card">
                        <div class="news-meta">
                            <span><i class="fa-solid fa-clock"></i> ${dateStr}</span>
                            <span>Yahoo Finance</span>
                        </div>
                        <h4>${title}</h4>
                        <a href="${link}" target="_blank" style="color: var(--accent); font-size: 14px; margin-bottom: 16px; text-decoration: none;"><i class="fa-solid fa-arrow-up-right-from-square"></i> Read full article</a>
                        
                        <button class="btn-secondary" onclick="app.askMentorAboutNews(\`${title.replace(/`/g, '')}\`)">
                            <i class="fa-solid fa-robot text-accent"></i> Ask Mentor
                        </button>
                    </div>
                `;
                grid.innerHTML += cardStyle;
            }

            if(count === 0) throw new Error("No items found");

        } catch (error) {
            console.error("Failed to load news:", error);
            // Fallback UI if fetch fails (e.g., proxy down or offline)
            grid.innerHTML = `
                <div class="glass-card" style="grid-column: 1 / -1; border-color: var(--warning);">
                    <h3 style="color: var(--warning);"><i class="fa-solid fa-triangle-exclamation"></i> Could not load live feed</h3>
                    <p style="margin-top: 10px;">We're having trouble reaching the Yahoo Finance feed right now. Please check your internet connection or try again later.</p>
                </div>
            `;
        }
    },

    askMentorAboutNews(articleTitle) {
        // Switch to the mentor view
        this.switchView('mentor');
        
        // Auto-fill the chat input
        const userInput = document.getElementById('userInput');
        userInput.value = `Can you explain this recent news headline to me simply: "${articleTitle}"`;
        
        // Focus the input so the user can just hit enter, or optionally auto-submit
        userInput.focus();
    },

    // Quests UI Logic
    setupQuests() {
        const modal = document.getElementById('questModal');
        const closeBtn = document.querySelector('.close-modal');
        const completeBtn = document.getElementById('btnCompleteQuest');
        
        // Open Modal
        document.querySelectorAll('.module-card').forEach(card => {
            card.addEventListener('click', () => {
                const questId = card.getAttribute('data-quest');
                if (!questId || !QUEST_DATA[questId]) return;

                const data = QUEST_DATA[questId];
                const isLocked = card.classList.contains('locked');
                
                document.getElementById('modalTitle').textContent = data.title;
                document.getElementById('modalIcon').innerHTML = `<i class="fa-solid ${data.icon}"></i>`;
                document.getElementById('modalIcon').style.color = data.color;
                document.getElementById('modalIcon').style.borderColor = data.color;
                document.getElementById('modalBody').innerHTML = data.content;

                if (isLocked) {
                    completeBtn.style.display = 'none';
                } else {
                    completeBtn.style.display = 'block';
                    completeBtn.onclick = () => {
                        card.classList.remove('active');
                        card.classList.add('completed');
                        card.querySelector('.progress .fill').style.width = '100%';
                        modal.classList.add('hidden');
                        
                        // XP update effect
                        const xpEl = document.querySelector('.stat-pill.xp span');
                        // Grab only the text content, strip 'XP', parse the int
                        let currentXP = parseInt(xpEl.textContent.replace('XP', '').trim());
                        if (isNaN(currentXP)) currentXP = 150; // Fallback
                        
                        xpEl.innerHTML = `<span style="color:var(--success)">${currentXP + 50} XP</span>`;
                        setTimeout(() => { xpEl.innerText = `${currentXP + 50} XP`; }, 2000);
                    };
                }

                modal.classList.remove('hidden');
            });
        });

        // Close Modal
        if(closeBtn) {
            closeBtn.addEventListener('click', () => modal.classList.add('hidden'));
        }
        if(modal) {
            modal.addEventListener('click', (e) => {
                if (e.target === modal) modal.classList.add('hidden');
            });
        }
        
        const toolModal = document.getElementById('toolModal');
        if(toolModal) {
            toolModal.addEventListener('click', (e) => {
                if (e.target === toolModal) toolModal.classList.add('hidden');
            });
        }
    }
};

// Start the app when DOM loads
document.addEventListener('DOMContentLoaded', () => app.init());
